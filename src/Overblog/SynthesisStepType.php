<?php
namespace Overblog\GraphQLBundle\__DEFINITIONS__;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Overblog\GraphQLBundle\Definition\ConfigProcessor;
use Overblog\GraphQLBundle\Definition\LazyConfig;
use Overblog\GraphQLBundle\Definition\GlobalVariables;
use Overblog\GraphQLBundle\Definition\Type\GeneratedTypeInterface;

/**
 * THIS FILE WAS GENERATED AND SHOULD NOT BE MODIFIED!
 */
final class SynthesisStepType extends ObjectType implements GeneratedTypeInterface
{
    public function __construct(
        ConfigProcessor $configProcessor,
        GlobalVariables $globalVariables = null
    ) {
        $configLoader = function (GlobalVariables $globalVariable) {
            return [
                'name' => 'SynthesisStep',
                'description' => 'A step in a project',
                'fields' =>
                    function () use ($globalVariable) {
                        return [
                            'id' => [
                                'type' => Type::nonNull(Type::id()),
                                'args' => [],
                                'resolve' => null,
                                'description' => 'The ID of the step',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'kind' => [
                                'type' => Type::nonNull(Type::string()),
                                'args' => [],
                                'resolve' =>
                                    function () use ($globalVariable) {
                                        return 'synthesis';
                                    },
                                'description' => 'The kind of the step',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'title' => [
                                'type' => Type::nonNull(Type::string()),
                                'args' => [],
                                'resolve' => null,
                                'description' => 'The title of the step',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'show_url' => [
                                'type' => Type::nonNull(Type::string()),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "Capco\\AppBundle\\GraphQL\\Resolver\\Step\\StepUrlResolver",
                                                array(0 => $value),
                                            ]);
                                    },
                                'description' => 'The url of the step',
                                'deprecationReason' => 'Use url instead of show_url',
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'url' => [
                                'type' => Type::nonNull(Type::string()),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "Capco\\AppBundle\\GraphQL\\Resolver\\Step\\StepUrlResolver",
                                                array(0 => $value),
                                            ]);
                                    },
                                'description' => 'The url of the step',
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
                        return [$globalVariable->get('typeResolver')->resolve('Step')];
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
