<?php
namespace Overblog\GraphQLBundle\__DEFINITIONS__;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Overblog\GraphQLBundle\Definition\ConfigProcessor;
use Overblog\GraphQLBundle\Definition\LazyConfig;
use Overblog\GraphQLBundle\Definition\GlobalVariables;
use Overblog\GraphQLBundle\Definition\Type\GeneratedTypeInterface;

/**
 * THIS FILE WAS GENERATED AND SHOULD NOT BE MODIFIED!
 */
final class MediaResponseType extends ObjectType implements GeneratedTypeInterface
{
    public function __construct(
        ConfigProcessor $configProcessor,
        GlobalVariables $globalVariables = null
    ) {
        $configLoader = function (GlobalVariables $globalVariable) {
            return [
                'name' => 'MediaResponse',
                'description' => 'A response',
                'fields' =>
                    function () use ($globalVariable) {
                        return [
                            'question' => [
                                'type' =>
                                    Type::nonNull(
                                        $globalVariable->get('typeResolver')->resolve('Question')
                                    ),
                                'args' => [],
                                'resolve' => null,
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'medias' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Media')
                                            )
                                        )
                                    ),
                                'args' => [],
                                'resolve' => null,
                                'description' => 'Medias',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                        ];
                    },
                'interfaces' =>
                    function () use ($globalVariable) {
                        return [$globalVariable->get('typeResolver')->resolve('Response')];
                    },
                'isTypeOf' => null,
                'resolveField' => null,
            ];
        };
        $config = $configProcessor
            ->process(LazyConfig::create($configLoader, $globalVariables))
            ->load();
        parent::__construct($config);
    }
}
