import React, {useState} from 'react'
import withPageAuthRequired from "@utils/withPageAuthRequired";
import Layout from "../components/Layout/Layout";
import {CapUIIconSize, Flex, Spinner} from "@cap-collectif/ui";
import {useIntl} from "react-intl";
import CreateProjectForm from "../components/Projects/CreateProject/CreateProjectForm";
import CreateProjectHelpMessage from "../components/Projects/CreateProject/CreateProjectHelpMessage";
import CreateProjectIllustration from "../components/Projects/CreateProject/CreateProjectIllustration";
import {graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader} from "react-relay";
import {NextPage} from "next";
import {PageProps} from "../types";
import type {createProjectQuery as createProjectQueryType} from '@relay/createProjectQuery.graphql';
import useFeatureFlag from "@hooks/useFeatureFlag";


export const CreateProjectQuery = graphql`
    query createProjectQuery {
        viewer {
            ...CreateProjectForm_viewer
        }
    }
`;

type CreateProjectPageProps = {
    queryReference: PreloadedQuery<createProjectQueryType>;
}

const CreateProjectPage: React.FC<CreateProjectPageProps> = ({queryReference}) => {
    const query = usePreloadedQuery(CreateProjectQuery, queryReference);
    const {viewer} = query;
    const [showHelpMessage, setShowHelpMessage] = useState(false)

    return (
        <>
            <Flex padding="32px">
                <Flex width="100%" height="100%">
                    <CreateProjectForm viewer={viewer} setShowHelpMessage={setShowHelpMessage}/>
                    <CreateProjectHelpMessage showHelpMessage={showHelpMessage}  />
                </Flex>
            </Flex>
            <Flex justifyContent="flex-end" mr="15%">
                <CreateProjectIllustration />
            </Flex>
        </>
    );
}

const CreateProject: NextPage<PageProps> = () => {
    const [queryReference, loadQuery, disposeQuery] = useQueryLoader<createProjectQueryType>(CreateProjectQuery);
    const intl = useIntl();
    React.useEffect(() => {
        loadQuery({});

        return () => {
            disposeQuery();
        };
    }, [disposeQuery, loadQuery]);

    return (
        <Layout navTitle={intl.formatMessage({id: 'new-project'})}>
            {queryReference ? (
                <React.Suspense
                    fallback={
                        <Flex alignItems="center" justifyContent="center">
                            <Spinner size={CapUIIconSize.Xxl} color="gray.150"/>
                        </Flex>
                    }>
                    <CreateProjectPage queryReference={queryReference}/>
                </React.Suspense>
            ) : null}
        </Layout>
    );
};


export const getServerSideProps = withPageAuthRequired;

export default CreateProject