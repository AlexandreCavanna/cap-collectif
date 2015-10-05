import CommentList from './CommentList';
import CommentForm from './CommentForm';
import CommentActions from '../../actions/CommentActions';
import CommentStore from '../../stores/CommentStore';
import Loader from '../Utils/Loader';
import FlashMessages from '../Utils/FlashMessages';

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const FormattedMessage = ReactIntl.FormattedMessage;
const MessagePagination = 10;

const CommentSection = React.createClass({
  propTypes: {
    uri: React.PropTypes.string,
    object: React.PropTypes.number,
  },
  mixins: [ReactIntl.IntlMixin],

  getInitialState() {
    return {
      countWithAnswers: 0,
      count: 0,
      comments: [],
      isReportingEnabled: true,
      isLoading: true,
      isLoadingMore: false,
      filter: 'last',
      offset: 0,
      limit: MessagePagination,
      messages: {
        'errors': [],
        'success': [],
      },
    };
  },

  componentWillMount() {
    CommentStore.addChangeListener(this.onChange);
  },

  componentDidMount() {
    this.loadCommentsFromServer();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filter !== prevState.filter) {
      this.loadCommentsFromServer();
    }
  },

  componentWillUnmount() {
    CommentStore.removeChangeListener(this.onChange);
  },

  onChange() {
    this.setState({
      messages: CommentStore.messages,
    });
    if (CommentStore.isSync) {
      this.setState(
      {
        countWithAnswers: CommentStore.countWithAnswers,
        count: CommentStore.count,
        isReportingEnabled: CommentStore.isReportingEnabled,
        comments: CommentStore.comments,
        isLoading: false,
        isLoadingMore: false,
      }, () => {
        this.resetLoadMoreButton();
      });
      return;
    }

    this.setState({
        isLoading: true,
    }, () => {
      this.loadCommentsFromServer();
    });
  },

  renderFilter() {
    if (this.state.count > 1) {
      return (
        <Col xsOffset={2} sm={4} className="hidden-xs" style={{marginTop: '30px', marginBottom: '20px'}}>
          <select ref="filter" className="form-control" value={this.state.filter} onChange={() => this.updateSelectedValue()}>
            <option value="popular">{this.getIntlMessage('global.filter_popular')}</option>
            <option value="last">{this.getIntlMessage('global.filter_last')}</option>
            <option value="old">{this.getIntlMessage('global.filter_old')}</option>
          </select>
        </Col>
      );
    }
  },

  renderLoadMore() {
    if (!this.state.isLoading && (this.state.limit < this.state.count || this.state.isLoadingMore)) {
      return (
        <button className="btn btn-block btn-dark-grey" ref="loadMore" data-loading-text={this.getIntlMessage('global.loading')} onClick={this.loadMore.bind(this)}>
          { this.getIntlMessage('comment.more') }
        </button>
      );
    }
    return <span />;
  },

  render() {
    return (
      <div className="comments__section">
        <FlashMessages errors={this.state.messages.errors} success={this.state.messages.success} />
        <Row>
          <Col componentClass="h2" sm={6}>
            <FormattedMessage
              message={this.getIntlMessage('comment.list')}
              num={this.state.countWithAnswers}
            />
          </Col>
          { this.renderFilter() }
        </Row>
        <Loader show={this.state.isLoading} />
        {(!this.state.isLoading
            ? <CommentForm comment={this.comment.bind(this)} focus={false} />
            : <span />
        )}
        <CommentList {...this.props}
          comments={this.state.comments}
          root={true}
          isReportingEnabled={this.state.isReportingEnabled}
        />
        { this.renderLoadMore() }
      </div>
    );
  },

  comment(data) {
    return CommentActions.create(this.props.uri, this.props.object, data);
  },

  updateSelectedValue() {
    this.setState({
        filter: $(React.findDOMNode(this.refs.filter)).val(),
        isLoading: true,
        comments: [],
    });
  },

  loadCommentsFromServer() {
    CommentActions.loadFromServer(
      this.props.uri,
      this.props.object,
      this.state.offset,
      this.state.limit,
      this.state.filter
    );
  },

  resetLoadMoreButton() {
    const loadMoreButton = React.findDOMNode(this.refs.loadMore);
    if (loadMoreButton) {
      $(loadMoreButton).button('reset');
    }
  },

  loadMore() {
    $(React.findDOMNode(this.refs.loadMore)).button('loading');
    this.setState({
        isLoadingMore: true,
        limit: this.state.limit + MessagePagination,
    }, () => {
      this.loadCommentsFromServer();
    });
  },

});

export default CommentSection;
