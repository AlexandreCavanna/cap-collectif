<?php

namespace Capco\AppBundle\Command;

use Box\Spout\Common\Type;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Box\Spout\Writer\WriterInterface;
use Capco\AppBundle\Command\Utils\ExportUtils;
use Capco\AppBundle\Entity\Questionnaire;
use Capco\AppBundle\Repository\QuestionnaireRepository;
use Capco\AppBundle\Resolver\ProjectDownloadResolver;
use Capco\AppBundle\Toggle\Manager;
use Capco\AppBundle\Traits\SnapshotCommandTrait;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class CreateCsvFromQuestionnaireCommand extends BaseExportCommand
{
    use SnapshotCommandTrait;
    protected $customFields;
    protected TranslatorInterface $translator;

    /**
     * @var WriterInterface
     */
    protected $writer;
    protected string $projectRootDir;

    private Manager $toggleManager;
    private ProjectDownloadResolver $projectDownloadResolver;
    private QuestionnaireRepository $questionnaireRepository;

    public function __construct(
        ExportUtils $exportUtils,
        ProjectDownloadResolver $projectDownloadResolver,
        QuestionnaireRepository $questionnaireRepository,
        Manager $manager,
        TranslatorInterface $translator,
        string $projectRootDir
    ) {
        $this->toggleManager = $manager;
        $this->projectDownloadResolver = $projectDownloadResolver;
        $this->questionnaireRepository = $questionnaireRepository;
        $this->customFields = [];
        $this->translator = $translator;
        $this->projectRootDir = $projectRootDir;
        parent::__construct($exportUtils);
    }

    public function generateSheet(
        Questionnaire $questionnaire,
        string $fileName,
        string $delimiter,
        OutputInterface $output,
        bool $projectAdmin = false
    ): void {
        $this->writer = WriterFactory::create(Type::CSV, $delimiter);
        $this->writer->openToFile(sprintf('%s/public/export/%s', $this->projectRootDir, $fileName));
        $output->writeln(
            '<info>' . sprintf('%s/public/export/%s', $this->projectRootDir, $fileName) . '</info>'
        );
        $headers = $this->projectDownloadResolver->getQuestionnaireHeaders(
            $questionnaire,
            $projectAdmin
        );
        $formattedHeaders = [];
        foreach ($headers as $header) {
            if (\is_array($header)) {
                $formattedHeaders[] = $header['label'];
            } else {
                $formattedHeaders[] = $header;
            }
        }
        $this->writer->addRow(WriterEntityFactory::createRowFromArray($formattedHeaders));

        $formattedEntries = $this->getFormattedData($questionnaire, $projectAdmin);
        $rows = [];
        foreach ($formattedEntries as $formattedData) {
            $row = [];
            foreach ($formattedHeaders as $header) {
                $row[] = \array_key_exists($header, $formattedData) ? $formattedData[$header] : '';
            }
            $rows[] = WriterEntityFactory::createRowFromArray($row);
        }
        $this->writer->addRows($rows);
        $this->writer->close();
    }

    public function getFormattedData(Questionnaire $questionnaire, bool $projectAdmin): array
    {
        $data = $this->projectDownloadResolver->getQuestionnaireData($questionnaire, $projectAdmin);
        foreach ($data as &$d) {
            foreach ($d as $key => $value) {
                $d[$key] = $this->exportUtils->parseCellValue(
                    $this->projectDownloadResolver->formatText($value)
                );
            }
        }

        return $data;
    }

    public static function getFileName(
        Questionnaire $questionnaire,
        bool $projectAdmin = false
    ): string {
        $step = $questionnaire->getStep();
        $extension = '.csv';
        if (!$step) {
            return self::getShortenedFilename($questionnaire->getSlug(), $extension, $projectAdmin);
        }

        $fileName = '';
        $project = $step->getProject();

        if ($project) {
            $fileName .= $project->getSlug() . '_';
        }
        $fileName .= $step->getSlug();

        return self::getShortenedFilename($fileName, $extension, $projectAdmin);
    }

    protected function configure(): void
    {
        parent::configure();
        $this->configureSnapshot();
        $this->setName('capco:export:questionnaire')
            ->setDescription('Create csv file from questionnaire step data')
            ->addOption(
                'force',
                false,
                InputOption::VALUE_NONE,
                'set this option to force export if feature toggle "export" is disabled'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        if (!$input->getOption('force') && !$this->toggleManager->isActive('export')) {
            $output->writeln('Please enable "export" feature to run this command');

            return 1;
        }
        $delimiter = $input->getOption('delimiter');
        $questionnaires = $this->questionnaireRepository->findAll();
        foreach ($questionnaires as $questionnaire) {
            $fileName = self::getFileName($questionnaire, false);
            $this->generateSheet($questionnaire, $fileName, $delimiter, $output, false);
            $this->executeSnapshot($input, $output, $fileName);

            if ($questionnaire->getOwner()) {
                $fileName = self::getFileName($questionnaire, true);
                $this->generateSheet($questionnaire, $fileName, $delimiter, $output, true);
                $this->executeSnapshot($input, $output, $fileName);
            }
        }

        return 0;
    }
}
