<?php
namespace Overblog\GraphQLBundle\__DEFINITIONS__;

use GraphQL\Type\Definition\EnumType;
use Overblog\GraphQLBundle\Definition\ConfigProcessor;
use Overblog\GraphQLBundle\Definition\LazyConfig;
use Overblog\GraphQLBundle\Definition\GlobalVariables;
use Overblog\GraphQLBundle\Definition\Type\GeneratedTypeInterface;

/**
 * THIS FILE WAS GENERATED AND SHOULD NOT BE MODIFIED!
 */
final class CommentPublicationStatusType extends EnumType implements GeneratedTypeInterface
{
    public function __construct(
        ConfigProcessor $configProcessor,
        GlobalVariables $globalVariables = null
    ) {
        $configLoader = function (GlobalVariables $globalVariable) {
            return [
                'name' => 'CommentPublicationStatus',
                'values' => [
                    'EXPIRED' => [
                        'name' => 'EXPIRED',
                        'value' => 'EXPIRED',
                        'deprecationReason' => null,
                        'description' => 'Was publicly visible, but has expired.',
                    ],
                    'PUBLISHED' => [
                        'name' => 'PUBLISHED',
                        'value' => 'PUBLISHED',
                        'deprecationReason' => null,
                        'description' => 'Normal status, Publicly visible',
                    ],
                    'TRASHED' => [
                        'name' => 'TRASHED',
                        'value' => 'TRASHED',
                        'deprecationReason' => null,
                        'description' => 'Publicly visible in the trash bin',
                    ],
                    'TRASHED_NOT_VISIBLE' => [
                        'name' => 'TRASHED_NOT_VISIBLE',
                        'value' => 'TRASHED_NOT_VISIBLE',
                        'deprecationReason' => null,
                        'description' => 'In the trash bin, content not visible',
                    ],
                ],
                'description' => 'Available statuses',
            ];
        };
        $config = $configProcessor
            ->process(LazyConfig::create($configLoader, $globalVariables))
            ->load();
        parent::__construct($config);
    }
}
