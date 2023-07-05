<?php

namespace Capco\AdminBundle\Resolver;

use Capco\AppBundle\Repository\ReportingRepository;

class RecentReportingResolver
{
    protected $reportingRepository;

    public function __construct(ReportingRepository $reportingRepository)
    {
        $this->reportingRepository = $reportingRepository;
    }

    public function getRecentReports(): array
    {
        return $this->reportingRepository->getRecentOrdered();
    }
}
