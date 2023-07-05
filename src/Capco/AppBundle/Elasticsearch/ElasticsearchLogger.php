<?php

namespace Capco\AppBundle\Elasticsearch;

use Psr\Log\LoggerInterface;

class ElasticsearchLogger implements LoggerInterface
{
    protected $logger;

    protected $queries = [];

    public function __construct(?LoggerInterface $logger = null)
    {
        $this->logger = $logger;
    }

    public function logQuery(
        string $path,
        string $method,
        $data,
        float $time,
        array $connection = [],
        array $query = [],
        float $engineTime = 0.0,
        int $itemCount = 0,
        ?array $response = null
    ): void {
        $e = new \Exception();

        $this->queries[] = [
            'path' => $path,
            'method' => $method,
            'data' => $data,
            'executionMS' => $time,
            'engineMS' => $engineTime,
            'connection' => $connection,
            'queryString' => $query,
            'itemCount' => $itemCount,
            'response' => $response,
            'backtrace' => $e->getTraceAsString(),
        ];

        if (null !== $this->logger) {
            $message = sprintf('%s (%s) %0.2f ms', $path, $method, $time * 1000);
            $this->logger->debug($message, ['query_dsl' => $data]);
        }
    }

    public function getQueriesCount(): int
    {
        return \count($this->queries);
    }

    public function getQueries(): array
    {
        return $this->queries;
    }

    public function emergency($message, array $context = []): void
    {
        $this->logger->emergency($message, $context);
    }

    public function alert($message, array $context = []): void
    {
        $this->logger->alert($message, $context);
    }

    public function critical($message, array $context = []): void
    {
        $this->logger->critical($message, $context);
    }

    public function error($message, array $context = []): void
    {
        $this->logger->error($message, $context);
    }

    public function warning($message, array $context = []): void
    {
        $this->logger->warning($message, $context);
    }

    public function notice($message, array $context = []): void
    {
        $this->logger->notice($message, $context);
    }

    public function info($message, array $context = []): void
    {
        $this->logger->info($message, $context);
    }

    public function debug($message, array $context = []): void
    {
        $this->logger->debug($message, $context);
    }

    public function log($level, $message, array $context = []): void
    {
        $this->logger->log($level, $message, $context);
    }
}
