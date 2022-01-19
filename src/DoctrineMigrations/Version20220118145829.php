<?php

declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220118145829 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'add body_using_jodit_wysiwyg to opinion_version';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE opinion_version ADD body_using_jodit_wysiwyg TINYINT(1) DEFAULT \'0\' NOT NULL, ADD comment_using_jodit_wysiwyg TINYINT(1) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE opinion_version DROP body_using_jodit_wysiwyg, DROP comment_using_jodit_wysiwyg');
    }
}
