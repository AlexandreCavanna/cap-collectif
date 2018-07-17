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
final class QueryType extends ObjectType implements GeneratedTypeInterface
{
    public function __construct(
        ConfigProcessor $configProcessor,
        GlobalVariables $globalVariables = null
    ) {
        $configLoader = function (GlobalVariables $globalVariable) {
            return [
                'name' => 'Query',
                'description' => null,
                'fields' =>
                    function () use ($globalVariable) {
                        return [
                            'viewer' => [
                                'type' =>
                                    Type::nonNull(
                                        $globalVariable->get('typeResolver')->resolve('User')
                                    ),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return \Overblog\GraphQLBundle\ExpressionLanguage\ExpressionFunction\Security\Helper::getUser(
                                            $globalVariable
                                        );
                                    },
                                'description' => 'The currently authenticated user.',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' =>
                                    function (
                                        $value,
                                        $args,
                                        $context,
                                        ResolveInfo $info,
                                        $object
                                    ) use ($globalVariable) {
                                        return $globalVariable
                                            ->get('container')
                                            ->get('security.authorization_checker')
                                            ->isGranted("ROLE_USER");
                                    },
                            ],
                            'users' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('User')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'superAdmin',
                                        'type' => Type::boolean(),
                                        'description' => 'Remove super admin from export.',
                                        'defaultValue' => false,
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["user", array(0 => $args)]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'consultations' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Consultation')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'id',
                                        'type' => Type::id(),
                                        'description' =>
                                            'If omitted, returns all consultations. If provided, returns the consultation of the particular id.',
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["consultation", array(0 => $args)]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'groups' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Group')
                                            )
                                        )
                                    ),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["groups", []]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' =>
                                    function (
                                        $value,
                                        $args,
                                        $context,
                                        ResolveInfo $info,
                                        $object
                                    ) use ($globalVariable) {
                                        return $globalVariable
                                            ->get('container')
                                            ->get('security.authorization_checker')
                                            ->isGranted("ROLE_ADMIN");
                                    },
                            ],
                            'proposalForms' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            $globalVariable
                                                ->get('typeResolver')
                                                ->resolve('ProposalForm')
                                        )
                                    ),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "Capco\\AppBundle\\GraphQL\\Resolver\\Query\\QueryProposalFormResolver",
                                                [],
                                            ]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'availableDistrictsForLocalisation' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('District')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'proposalFormId',
                                        'type' => Type::nonNull(Type::id()),
                                        'description' => null,
                                    ],
                                    [
                                        'name' => 'latitude',
                                        'type' => Type::nonNull(Type::float()),
                                        'description' => null,
                                    ],
                                    [
                                        'name' => 'longitude',
                                        'type' => Type::nonNull(Type::float()),
                                        'description' => null,
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "query_available_districts_for_location",
                                                array(
                                                    0 => $args["proposalFormId"],
                                                    1 => $args["latitude"],
                                                    2 => $args["longitude"],
                                                ),
                                            ]);
                                    },
                                'description' =>
                                    'Retrieve availables districts for a given address',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'votesByContribution' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('ProposalVote')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'contribution',
                                        'type' => Type::nonNull(Type::id()),
                                        'description' => null,
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["votesByContribution", array(0 => $args)]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'contributions' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Opinion')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'consultation',
                                        'type' => Type::nonNull(Type::id()),
                                        'description' =>
                                            'Returns all contributions of the provided consultation.',
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["contributions", array(0 => $args)]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'contributionsBySection' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Opinion')
                                            )
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'sectionId',
                                        'type' => Type::nonNull(Type::id()),
                                        'description' => null,
                                    ],
                                    [
                                        'name' => 'limit',
                                        'type' => Type::nonNull(Type::int()),
                                        'description' => 'Max depth.',
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "contributionsBySection",
                                                array(0 => $args),
                                            ]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'question' => [
                                'type' =>
                                    Type::nonNull(
                                        $globalVariable->get('typeResolver')->resolve('Question')
                                    ),
                                'args' => [
                                    [
                                        'name' => 'id',
                                        'type' => Type::nonNull(Type::int()),
                                        'description' => null,
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["query_question", array(0 => $args)]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'availableQuestionnaires' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            Type::nonNull(
                                                $globalVariable
                                                    ->get('typeResolver')
                                                    ->resolve('Questionnaire')
                                            )
                                        )
                                    ),
                                'args' => [],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve(["query_get_available_questionnaires", []]);
                                    },
                                'description' => null,
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'node' => [
                                'type' => $globalVariable->get('typeResolver')->resolve('Node'),
                                'args' => [
                                    [
                                        'name' => 'id',
                                        'type' => Type::nonNull(Type::id()),
                                        'description' => 'The ID of an object',
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable->get('resolverResolver')->resolve([
                                            "relay_node_field",
                                            array(
                                                0 => $args,
                                                1 => $context,
                                                2 => $info,
                                                3 =>
                                                    function ($value) use (
                                                        $globalVariable,
                                                        $args,
                                                        $context,
                                                        $info
                                                    ) {
                                                        return $globalVariable
                                                            ->get('resolverResolver')
                                                            ->resolve([
                                                                "query_node",
                                                                array(
                                                                    0 => $value,
                                                                    1 =>
                                                                        \Overblog\GraphQLBundle\ExpressionLanguage\ExpressionFunction\Security\Helper::getUser(
                                                                            $globalVariable
                                                                        ),
                                                                ),
                                                            ]);
                                                    },
                                            ),
                                        ]);
                                    },
                                'description' => 'Fetches an object given its ID',
                                'deprecationReason' => null,
                                'complexity' => null,
                                # public and access are custom options managed only by the bundle
                                'public' => null,
                                'access' => null,
                            ],
                            'nodes' => [
                                'type' =>
                                    Type::nonNull(
                                        Type::listOf(
                                            $globalVariable->get('typeResolver')->resolve('Node')
                                        )
                                    ),
                                'args' => [
                                    [
                                        'name' => 'ids',
                                        'type' =>
                                            Type::nonNull(Type::listOf(Type::nonNull(Type::id()))),
                                        'description' => 'The list of node IDs.',
                                    ],
                                ],
                                'resolve' =>
                                    function ($value, $args, $context, ResolveInfo $info) use (
                                        $globalVariable
                                    ) {
                                        return $globalVariable
                                            ->get('resolverResolver')
                                            ->resolve([
                                                "query_nodes",
                                                array(
                                                    0 => $args["ids"],
                                                    1 =>
                                                        \Overblog\GraphQLBundle\ExpressionLanguage\ExpressionFunction\Security\Helper::getUser(
                                                            $globalVariable
                                                        ),
                                                ),
                                            ]);
                                    },
                                'description' => 'Lookup nodes by a list of IDs.',
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
                        return [];
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
