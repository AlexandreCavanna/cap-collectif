<?php

namespace Capco\AppBundle\Traits;

trait FormatDateTrait
{
    public function getTime(\DateTimeInterface $dateTime): string
    {
        return $dateTime->format('H:i:s');
    }

    public function getLongDate(
        \DateTimeInterface $dateTime,
        string $locale,
        string $timezone,
        $format = \IntlDateFormatter::FULL
    ): string {
        $dateFormatter = new \IntlDateFormatter(
            $locale,
            $format,
            \IntlDateFormatter::NONE,
            static::clearTimeZone($timezone),
            \IntlDateFormatter::GREGORIAN
        );

        return $dateFormatter->format($dateTime->getTimestamp());
    }

    public static function clearTimeZone(string $timezone): string
    {
        return explode(' ', $timezone)[0];
    }
}
