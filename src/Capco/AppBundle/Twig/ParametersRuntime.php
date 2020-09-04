<?php

namespace Capco\AppBundle\Twig;

use Capco\AppBundle\Cache\RedisCache;
use Capco\AppBundle\Repository\LocaleRepository;
use Capco\AppBundle\SiteColor\Resolver as SiteColorResolver;
use Capco\AppBundle\SiteParameter\SiteParameterResolver;
use Capco\AppBundle\Toggle\Manager;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\RuntimeExtensionInterface;

class ParametersRuntime implements RuntimeExtensionInterface
{
    public const CACHE_KEY = 'site-parameters';
    protected $cache;
    protected $router;
    protected $manager;
    protected $translator;
    protected $siteColorResolver;
    protected $siteParameterResolver;
    protected $requestStack;
    protected $localeRepository;

    public function __construct(
        Manager $manager,
        RedisCache $cache,
        RouterInterface $router,
        SiteParameterResolver $siteParameterResolver,
        TranslatorInterface $translator,
        SiteColorResolver $siteColorResolver,
        RequestStack $requestStack,
        LocaleRepository $localeRepository
    ) {
        $this->cache = $cache;
        $this->router = $router;
        $this->manager = $manager;
        $this->translator = $translator;
        $this->siteColorResolver = $siteColorResolver;
        $this->siteParameterResolver = $siteParameterResolver;
        $this->requestStack = $requestStack;
        $this->localeRepository = $localeRepository;
    }

    public function getIsFeatureEnabled($flag): bool
    {
        return $this->manager->isActive($flag);
    }

    public function getHasFeatureEnabled($flags): bool
    {
        return $this->manager->hasOneActive($flags);
    }

    public function getFeatures(): array
    {
        return $this->manager->all();
    }

    public function getSiteParameters(): array
    {
        $request = $this->requestStack->getCurrentRequest();
        $defaultLocale = $this->siteParameterResolver->getDefaultLocale();
        $locale = $request ? $request->getLocale() : $defaultLocale;

        $cachedItem = $this->cache->getItem(self::CACHE_KEY . $locale);

        if (!$cachedItem->isHit()) {
            $slug = strtolower($this->translator->trans('charter', [], 'CapcoAppBundle'));
            $keys = [
                'login.text.top',
                'login.text.bottom',
                'contact.customcode',
                'contact.metadescription',
                'global.site.organization_name',
                'snalytical-tracking-scripts-on-all-pages',
                'ad-scripts-on-all-pages',
                'cookies-list',
                'privacy-policy',
                'charter.body',
                'events.map.country',
                'admin.mail.notifications.receive_address',
            ];

            $exposedParameters = [];
            foreach ($keys as $key) {
                $value = $this->siteParameterResolver->getValue($key, $locale, null);
                $exposedParameters[$key] = $value && '' !== $value ? $value : null;
            }
            $exposedParameters['signin.cgu.name'] = $this->translator->trans(
                'the-charter',
                [],
                'CapcoAppBundle'
            );
            $exposedParameters['signin.cgu.link'] = $this->router->generate('app_page_show', [
                'slug' => $slug,
            ]);

            // Add colors
            $colors = [
                'color.main_menu.bg',
                'color.main_menu.bg_active',
                'color.main_menu.text',
                'color.main_menu.text_hover',
                'color.main_menu.text_active',
                'color.btn.primary.bg',
                'color.btn.primary.text',
                'color.section.bg',
                'color.body.bg',
            ];

            foreach ($colors as $color) {
                $value = $this->siteColorResolver->getValue($color);
                $exposedParameters[$color] = $value && '' !== $value ? $value : null;
            }

            $cachedItem->set($exposedParameters)->expiresAfter(RedisCache::ONE_MINUTE);
            $this->cache->save($cachedItem);
        }

        return $cachedItem->get();
    }

    public function getAvailableLocales(): array
    {
        return $this->localeRepository->findPublishedLocales();
    }
}