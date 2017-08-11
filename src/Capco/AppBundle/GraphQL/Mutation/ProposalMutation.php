<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\Responses\AbstractResponse;
use Capco\AppBundle\Entity\Responses\MediaResponse;
use Capco\AppBundle\Entity\Selection;
use Capco\AppBundle\Entity\Steps\SelectionStep;
use Capco\AppBundle\Form\ProposalAdminType;
use Capco\AppBundle\Form\ProposalNotationType;
use Capco\AppBundle\Form\ProposalProgressStepType;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Error\UserError;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

class ProposalMutation implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function delete(string $proposalId): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $proposal = $em->find('CapcoAppBundle:Proposal', $proposalId);
        if (!$proposal) {
            throw new UserError(sprintf('Unknown proposal with id "%d"', $proposalId));
        }
        // $em->remove($proposal->getSelections());
        $em->remove($proposal);
        $em->flush();

        return ['proposal' => $proposal];
    }

    public function changeNotation(Argument $input)
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $formFactory = $this->container->get('form.factory');

        $values = $input->getRawArguments();
        $proposal = $em->find('CapcoAppBundle:Proposal', $values['proposalId']);
        unset($values['proposalId']); // This only usefull to retrieve the proposal

        $form = $formFactory->create(ProposalNotationType::class, $proposal);
        $form->submit($values);

        if (!$form->isValid()) {
            throw new UserError('Input not valid : ' . (string) $form->getErrors(true, false));
        }

        $em->flush();

        return ['proposal' => $proposal];
    }

    public function changeProgressSteps(Argument $input): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $formFactory = $this->container->get('form.factory');
        $logger = $this->container->get('logger');

        $values = $input->getRawArguments();
        $proposal = $em->find('CapcoAppBundle:Proposal', $values['proposalId']);
        if (!$proposal) {
            throw new UserError(sprintf('Unknown proposal with id "%d"', $values['proposalId']));
        }
        unset($values['proposalId']); // This only usefull to retrieve the proposal

        $logger->info('changeProgressSteps:' . json_encode($values, true));

        $form = $formFactory->create(ProposalProgressStepType::class, $proposal);
        $form->submit($values);

        if (!$form->isValid()) {
            throw new UserError('Input not valid : ' . (string) $form->getErrors(true, false));
        }

        $em->flush();

        return ['proposal' => $proposal];
    }

    public function changeCollectStatus(string $proposalId, $statusId = null): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');

        $proposal = $em->find('CapcoAppBundle:Proposal', $proposalId);
        if (!$proposal) {
            throw new UserError('Cant find the proposal');
        }

        $status = null;
        if ($statusId) {
            $status = $em->getRepository('CapcoAppBundle:Status')->find($statusId);
        }

        $proposal->setStatus($status);
        $em->flush();

        $this->container->get('capco.notify_manager')->notifyProposalStatusChangeInCollect($proposal);

        return ['proposal' => $proposal];
    }

    public function changeSelectionStatus(string $proposalId, string $stepId, $statusId = null): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');

        $selection = $em->getRepository('CapcoAppBundle:Selection')->findOneBy([
          'proposal' => $proposalId,
          'selectionStep' => $stepId,
        ]);

        if (!$selection) {
            throw new UserError('Cant find the selection');
        }

        $status = null;
        if ($statusId) {
            $status = $em->getRepository('CapcoAppBundle:Status')->find($statusId);
        }

        $selection->setStatus($status);
        $em->flush();

        $this->container->get('capco.notify_manager')->notifyProposalStatusChangeInSelection($selection);

        $proposal = $em->find('CapcoAppBundle:Proposal', $proposalId);

        return ['proposal' => $proposal];
    }

    public function unselectProposal(string $proposalId, string $stepId): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $selection = $em->getRepository('CapcoAppBundle:Selection')
                      ->findOneBy(['proposal' => $proposalId, 'selectionStep' => $stepId]);

        if (!$selection) {
            throw new UserError('Cant find the selection');
        }
        $em->remove($selection);
        $em->flush();

        $proposal = $em->find('CapcoAppBundle:Proposal', $proposalId);

        return ['proposal' => $proposal];
    }

    public function selectProposal(string $proposalId, string $stepId): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');

        $selection = $em->getRepository('CapcoAppBundle:Selection')
                      ->findOneBy(['proposal' => $proposalId, 'selectionStep' => $stepId]);
        if ($selection) {
            throw new UserError('Already selected');
        }

        $proposal = $em->getRepository('CapcoAppBundle:Proposal')->find($proposalId);
        $step = $em->getRepository('CapcoAppBundle:Steps\SelectionStep')->find($stepId);

        $selection = new Selection();
        $selection->setSelectionStep($step);
        $proposal->addSelection($selection);

        $em->persist($selection);
        $em->flush();

        return ['proposal' => $proposal];
    }

    public function changePublicationStatus(Argument $values): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $proposal = $em->find('CapcoAppBundle:Proposal', $values['proposalId']);
        if (!$proposal) {
            throw new UserError(sprintf('Unknown proposal with id "%d"', $values['proposalId']));
        }

        switch ($values['publicationStatus']) {
          case 'TRASHED':
              $proposal->setExpired(false);
              $proposal->setEnabled(true);
              $proposal->setTrashed(true);
              $proposal->setTrashedReason($values['trashedReason']);
              $proposal->setDeletedAt(null);
              break;
          case 'PUBLISHED':
              $proposal->setExpired(false);
              $proposal->setEnabled(true);
              $proposal->setTrashed(false);
              $proposal->setDeletedAt(null);
              break;
          case 'TRASHED_NOT_VISIBLE':
            $proposal->setExpired(false);
            $proposal->setEnabled(false);
            $proposal->setTrashed(true);
            $proposal->setTrashedReason($values['trashedReason']);
            $proposal->setDeletedAt(null);
            break;
          default:
            break;
        }

        $em->flush();

        return ['proposal' => $proposal];
    }

    public function changeContent(Argument $input, Request $request): array
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $logger = $this->container->get('logger');
        $formFactory = $this->container->get('form.factory');
        $mediaManager = $this->container->get('capco.media.manager');
        $user = $this->container->get('security.token_storage')->getToken()->getUser();

        $values = $input->getRawArguments();
        $values['responses'] = array_map(function ($value) {
            $value['_type'] = 'value_response';

            return $value;
        }, $values['responses']);

        $logger->info('changeContent:' . json_encode($values, true));

        $proposal = $em->find('CapcoAppBundle:Proposal', $values['id']);
        if (!$proposal) {
            throw new UserError(sprintf('Unknown proposal with id "%d"', $values['id']));
        }

        unset($values['id']); // This only usefull to retrieve the proposal

        // Handle media deletion
        if (isset($values['deleteCurrentMedia']) && $values['deleteCurrentMedia'] === true) {
            if ($proposal->getMedia()) {
                $em->remove($proposal->getMedia());
                $proposal->setMedia(null);
            }
        }
        unset($values['deleteCurrentMedia']);

        // Handle File upload for key `media`
        $uploadedMedia = $request->files->get('media');
        if ($uploadedMedia instanceof UploadedFile) {
            $logger->info('UploadedMedia:' . $uploadedMedia->getClientOriginalName());
            if ($proposal->getMedia()) {
                $em->remove($proposal->getMedia());
            }
            $media = $mediaManager->createFileFromUploadedFile($uploadedMedia);
            $proposal->setMedia($media);
            $request->files->remove('media');
        }
        unset($values['media']);

        // Now we handle file uploads for every responses
        foreach ($request->files->all() as $key => $file) {
            $logger->info('File: ' . $key);
            if (strpos($key, 'responses_') === false) {
                break;
            }
            $questionId = str_replace('responses.', '', $key);
            $question = $em->find('CapcoAppBundle:Questions\AbstractQuestion', (int) $questionId);
            if (!$question) {
                throw new UserError(sprintf('Unknown question with id "%d"', (int) $questionId));
            }
            $response = $proposal->getResponses()->filter(
                  function (AbstractResponse $res) use ($questionId) {
                      return (int) $res->getQuestion()->getId() === (int) $questionId;
                  }
              )->first();
            if (!$response) {
                $response = new MediaResponse();
                $response->setQuestion($question);
                $proposal->addResponse($response);
            }
            $media = $mediaManager->createFileFromUploadedFile($uploadedMedia);
            $response->addMedia($media);
        }

        foreach ($values['responses'] as $valueResponse) {
            $valueResponse['_type'] = 'value_response';
        }

       // Now we can submit the form without anything related to file uploads
       $form = $formFactory->create(ProposalAdminType::class, $proposal, [
           'proposalForm' => $proposal->getProposalForm(),
       ]);

        $form->submit($values);
        if (!$form->isValid()) {
            throw new UserError('Input not valid : ' . (string) $form->getErrors(true, false));
        }

        $proposal->setUpdateAuthor($user);
        $em->flush();

        return ['proposal' => $proposal];
    }
}
