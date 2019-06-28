<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190628145101 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE logic_jump DROP always');
        $this->addSql('ALTER TABLE question ADD always_jump_question_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494ED591D250 FOREIGN KEY (always_jump_question_id) REFERENCES questionnaire_abstractquestion (id)');
        $this->addSql('CREATE INDEX IDX_B6F7494ED591D250 ON question (always_jump_question_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE logic_jump ADD always TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494ED591D250');
        $this->addSql('DROP INDEX IDX_B6F7494ED591D250 ON question');
        $this->addSql('ALTER TABLE question DROP always_jump_question_id');
    }
}
