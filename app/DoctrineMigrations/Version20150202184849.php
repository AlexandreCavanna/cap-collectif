<?php

namespace Application\Migrations;

use Capco\AppBundle\Entity\SiteImage;
use Capco\ClassificationBundle\Entity\Context;
use Capco\MediaBundle\Entity\Media;
use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150202184849 extends AbstractMigration implements ContainerAwareInterface
{
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function up(Schema $schema)
    {

    }

    public function postUp(Schema $schema)
    {
        $em = $this->container->get('doctrine.orm.entity_manager');

        $media = new Media();
        $media->setBinaryContent('app/Resources/img/default_avatar.jpg');
        $media->setEnabled(true);
        $media->setName('Avatar');
        $media->setContext('default');
        $media->setProviderName('sonata.media.provider.image');
        $this->container->get('sonata.media.manager.media')->save($media);

        $siteImage = new SiteImage();
        $siteImage->setKeyname('image.default_avatar');
        $siteImage->setMedia($media);
        $siteImage->setIsEnabled(true);
        $siteImage->setTitle('Avatar par défaut');
        $siteImage->setPosition(4);
        $em->persist($siteImage);

        $em->flush();
    }

    public function down(Schema $schema)
    {

    }

    public function postDown(Schema $schema)
    {
        $em = $this->container->get('doctrine.orm.entity_manager');

        $siteImage = $em->getRepository('CapcoAppBundle:SiteImage')->findOneByKeyname('image.default_avatar');
        if (null != $siteImage) {
            $media = $siteImage->getMedia();
            if (null != $media) {
                $em->remove($media);
            }
            $em->remove($siteImage);

            $em->flush();
        }
    }
}
