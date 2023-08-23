// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { graphql, createFragmentContainer } from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import type { GlobalState, Dispatch, FeatureToggles } from '~/types';
import ProposalListSearch from './ProposalListSearch';
import ProposalListOrderSorting from './ProposalListOrderSorting';
import { changeFilter, type Filters } from '~/redux/modules/proposal';
import ProposalListToggleViewBtn from './ProposalListToggleViewBtn';
import type { ProposalListFilters_step } from '~relay/ProposalListFilters_step.graphql';
import Select from '~ui/Form/Select/Select';
import SelectOption from '~ui/Form/Select/SelectOption';
import type { ProposalViewMode } from '~/redux/modules/proposal';

type defaultOption = {|
  +id: string,
  +name: ?string,
|};

type themeOption = {|
  id: string,
  title: string,
  slug: string,
  name: string,
|};

type Props = {|
  step: ProposalListFilters_step,
  features: FeatureToggles,
  dispatch: Dispatch,
  filters: Filters,
  types: $ReadOnlyArray<defaultOption>,
  themes: Array<themeOption>,
  setDisplayMode: () => void,
  displayMode: ProposalViewMode,
  intl: IntlShape,
|};

type Options = {|
  types: $ReadOnlyArray<defaultOption>,
  categories?: $ReadOnlyArray<defaultOption>,
  districts?: $ReadOnlyArray<defaultOption>,
  themes: $ReadOnlyArray<themeOption>,
  statuses: $ReadOnlyArray<defaultOption>,
  state: $ReadOnlyArray<defaultOption>,
|};

export class ProposalListFilters extends React.Component<Props> {
  onClickHandler = (e: SyntheticEvent<HTMLButtonElement>, filterName: string) => {
    const { dispatch } = this.props;
    return dispatch(changeFilter(filterName, e.currentTarget.value));
  };

  getSelectedValueFromFilterOptions = (
    defaultMessage: string,
    options: Options,
    filters: Filters,
    filterName: string,
  ) => {
    if (!filters[filterName] || filters[filterName] === '0') {
      return defaultMessage;
    }

    const selectedOption = options[filterName]
      .filter(option => option.id == filters[filterName]) // eslint-disable-line eqeqeq
      .shift();

    if (!selectedOption) {
      return defaultMessage;
    }

    return filterName !== 'themes' ? selectedOption.name : selectedOption.title;
  };

  render() {
    const { features, step, filters, types, themes, setDisplayMode, displayMode, intl } = this.props;

    const { form } = step;

    const options = {
      types,
      categories: form?.categories,
      districts: form?.districts,
      themes,
      statuses: step.statuses,
      state: [
        { id: 'PUBLISHED', name: intl.formatMessage({ id: 'global.published' }) },
        { id: 'ARCHIVED', name: intl.formatMessage({ id: 'global-archived' }) },
      ]
    };

    const displayedFilters: string[] = []
      .concat(features.user_type && options.types.length > 0 ? ['types'] : [])
      .concat(
        features.districts &&
          options.districts &&
          options.districts.length > 0 &&
          form?.usingDistrict
          ? ['districts']
          : [],
      )
      .concat(features.themes && form?.usingThemes && options.themes.length > 0 ? ['themes'] : [])
      .concat(
        form?.usingCategories && options.categories && options.categories.length > 1
          ? ['categories']
          : [],
      )
      .concat(options.statuses.length > 0 ? ['statuses'] : [])
      .concat(step?.proposalArchivedTime > 0 ? ['state'] : [])

    const orderByVotes = step.voteType !== 'DISABLED';
    const orderByPoints = step.votesRanking;
    const orderByComments = form?.commentable;
    const orderByCost = form?.costable;
    const showMapButton = form?.usingAddress && !step.private && !!features.display_map;

    return (
      <div className="mb-15 mt-30" id="proposal-list-filter">
        <Row>
          <ProposalListToggleViewBtn
            step={step}
            showMapButton={showMapButton ?? false}
            setDisplayMode={setDisplayMode}
            displayMode={displayMode}
          />

          <Col xs={12} sm={6} md={4} lg={3}>
            {/* $FlowFixMe please use mapDispatchToProps */}
            <ProposalListSearch />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3} id="proposal-filter-sorting">
            {/* $FlowFixMe please use mapDispatchToProps */}
            <ProposalListOrderSorting
              orderByCost={orderByCost}
              orderByComments={orderByComments}
              orderByVotes={orderByVotes}
              orderByPoints={orderByPoints}
              defaultSort={step.defaultSort}
              objectType={step.form?.objectType}
              canDisplayBallot={step.canDisplayBallot}
            />
          </Col>
          {displayedFilters.map((filterName, index) => (
            <Col xs={12} sm={6} md={4} lg={3} key={index} id={`proposal-filter-${filterName}`}>
              <FormattedMessage id={`global.select_${filterName}`}>
                {(message: string) => (
                  <Select
                    label={this.getSelectedValueFromFilterOptions(
                      message,
                      options,
                      filters,
                      filterName,
                    )}
                    id={`proposal-filter-${filterName}-button`}>
                    <SelectOption
                      onClick={e => this.onClickHandler(e, filterName)}
                      isSelected={!filters[filterName] || filters[filterName] === '0'}
                      value="0">
                      {message}
                    </SelectOption>
                    {options[filterName].map(choice => (
                      <SelectOption
                        onClick={e => this.onClickHandler(e, filterName)}
                        isSelected={filters[filterName] == choice.id} // eslint-disable-line eqeqeq
                        value={choice.id}
                        key={choice.id}>
                        {choice.title || choice.name}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormattedMessage>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  features: state.default.features,
  themes: state.default.themes,
  types: state.default.userTypes,
  filters: state.proposal.filters || {},
});

const withIntl = injectIntl(ProposalListFilters);

const container = connect<any, any, _, _, _, _>(mapStateToProps)(withIntl);

export default createFragmentContainer(container, {
  step: graphql`
    fragment ProposalListFilters_step on ProposalStep {
      id
      canDisplayBallot
      ... on CollectStep {
        private
      }
      defaultSort
      voteType
      votesRanking
      statuses {
        id
        name
      }
      proposalArchivedTime
      form {
        usingDistrict
        usingAddress
        usingThemes
        commentable
        costable
        usingCategories
        districts(order: ALPHABETICAL) {
          id
          name
        }
        categories(order: ALPHABETICAL) {
          id
          name
        }
        objectType
      }
      ...ProposalListToggleViewBtn_step
    }
  `,
});
