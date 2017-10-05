var App = React.createClass({
    getInitialState: function() {
        return {
            pageSize: 2
        }
    }

    , render: function() {
        return <div>
            <TopicListing topics={this.props.topics} pageSize={this.state.pageSize}/>
            <Config pageSize={this.state.pageSize} handlePageSizeChange={this.handlePageSizeChange}/>
        </div>
    }

    , handlePageSizeChange: function(e) {
        this.setState({
            pageSize: Number(e.target.value)
        })
    }
})

var Config = React.createClass({
    render: function() {
        return <div>
            <h2>Config</h2>
            <label htmlFor="pageSize">Page Size:</label>
            <select id="pageSize" value={this.props.pageSize} onChange={this.props.handlePageSizeChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
    }
})

var TopicListing = React.createClass({
    getInitialState: function() {
        return {
            currentPage: 1
        }
    }

    , componentWillReceiveProps: function(nextProps) {
        this.setState({
            currentPage: 1
        })
    }

    , render: function() {
        var page = this.getPage()
        var topics = page.topics.map(function(topic) {
            return <tr key={topic.id}>
                <td>{topic.title}</td>
                <td>{topic.posts}</td>
            </tr>
        })
        return <div>
            <h2>Topic Listing</h2>
            {pager(page)}
            <table>
                <thead>
                <tr>
                    <th>Topic</th>
                    <th>Posts</th>
                </tr>
                </thead>
                <tbody>
                {topics}
                </tbody>
            </table>
            {pager(page)}
        </div>
    }

    /**
     * Gets the current page of topics along with some pagination info.
     */
    , getPage: function() {
        var start = this.props.pageSize * (this.state.currentPage - 1)
        var end = start + this.props.pageSize

        return {
            currentPage: this.state.currentPage
            , topics: this.props.topics.slice(start, end)
            , numPages: this.getNumPages()
            , handleClick: function(pageNum) {
                return function() { this.handlePageChange(pageNum) }.bind(this)
            }.bind(this)
        }
    }

    /**
     * Calculates the total number of pages.
     */
    , getNumPages: function() {
        var numPages = Math.floor(this.props.topics.length / this.props.pageSize)
        if (this.props.topics.length % this.props.pageSize > 0) {
            numPages++
        }
        return numPages
    }

    , handlePageChange: function(pageNum) {
        this.setState({currentPage: pageNum})
    }
})

/**
 * Renders a pager component.
 */
function pager(page) {
    var pageLinks = []
    if (page.currentPage > 1) {
        if (page.currentPage > 2) {
            pageLinks.push(<span className="pageLink" onClick={page.handleClick(1)}>«</span>)
            pageLinks.push(' ')
        }
        pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.currentPage - 1)}>‹</span>)
        pageLinks.push(' ')
    }
    pageLinks.push(<span className="currentPage">Page {page.currentPage} of {page.numPages}</span>)
    if (page.currentPage < page.numPages) {
        pageLinks.push(' ')
        pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.currentPage + 1)}>›</span>)
        if (page.currentPage < page.numPages - 1) {
            pageLinks.push(' ')
            pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.numPages)}>»</span>)
        }
    }
    return <div className="pager">{pageLinks}</div>
}

var topics = [
    {id: 1 ,title: 'Test 1', posts: 1}
    , {id: 2 ,title: 'Test 2', posts: 2}
    , {id: 3 ,title: 'Test 3', posts: 3}
    , {id: 4 ,title: 'Test 4', posts: 4}
    , {id: 5 ,title: 'Test 5', posts: 5}
    , {id: 6 ,title: 'Test 6', posts: 6}
    , {id: 7 ,title: 'Test 7', posts: 7}
    , {id: 8 ,title: 'Test 8', posts: 8}
]

ReactDOM.render(
    <App topics={topics}/>,
    document.getElementById('content')
);

