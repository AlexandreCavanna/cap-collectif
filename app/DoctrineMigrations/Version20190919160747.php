<?php

declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190919160747 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf(
            'mysql' !== $this->connection->getDatabasePlatform()->getName(),
            'Migration can only be executed safely on \'mysql\'.'
        );

        $this->addSql(
            'CREATE TABLE ProjectDistrictPositioner (id CHAR(36) NOT NULL COMMENT \'(DC2Type:guid)\', district_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:guid)\', project_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:guid)\', position INT NOT NULL, INDEX IDX_E0C81C16B08FA272 (district_id), INDEX IDX_E0C81C16166D1F9C (project_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB'
        );
        $this->addSql(
            'ALTER TABLE ProjectDistrictPositioner ADD CONSTRAINT FK_E0C81C16B08FA272 FOREIGN KEY (district_id) REFERENCES district (id)'
        );
        $this->addSql(
            'ALTER TABLE ProjectDistrictPositioner ADD CONSTRAINT FK_E0C81C16166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)'
        );
        $this->addSql('DROP TABLE project_district');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf(
            'mysql' !== $this->connection->getDatabasePlatform()->getName(),
            'Migration can only be executed safely on \'mysql\'.'
        );

        $this->addSql(
            'CREATE TABLE project_district (project_id CHAR(36) NOT NULL COLLATE utf8_unicode_ci COMMENT \'(DC2Type:guid)\', projectdistrict_id CHAR(36) NOT NULL COLLATE utf8_unicode_ci COMMENT \'(DC2Type:guid)\', INDEX IDX_C8FDF5C166D1F9C (project_id), INDEX IDX_C8FDF5CCB622938 (projectdistrict_id), PRIMARY KEY(project_id, projectdistrict_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' '
        );
        $this->addSql(
            'ALTER TABLE project_district ADD CONSTRAINT FK_C8FDF5CCB622938 FOREIGN KEY (projectdistrict_id) REFERENCES district (id) ON DELETE CASCADE'
        );
        $this->addSql(
            'ALTER TABLE project_district ADD CONSTRAINT FK_C8FDF5C166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE'
        );
        $this->addSql('DROP TABLE ProjectDistrictPositioner');
    }
}
