var FR = {};


FR.Header = React.createClass({
    logout: function () {
        window.location.href = '/login';
    },
    render: function () {
        var email = FRUTILS.getUser();
        return (
            <div className="header">
                <img src="../static/images/logo1.png" className="logo1"/>
                <div className="profile1">
                    <img src="../static/images/profile1.png"/>
                    {email}&nbsp;
                    <input type="submit" value="LOGOUT" className="btn btn-info" onClick={this.logout}/>
                </div>
            </div>
        )
    }
});

FR.FilesToolbar = React.createClass({
    getInitialState: function () {
        return {
            area: 'all',
            daterangetext: 'Loading...'

        };
    },
    componentDidMount: function () {

        console.log('[componentDidMount]');

        var start = moment().subtract(7, 'days');
        var end = moment();
        var self = this;

        function cb(start, end) {
            self.state.daterangetext = start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY');
            self.state.start_date = start.format('MM/DD/YYYY');
            self.state.end_date = start.format('MM/DD/YYYY');
            self.forceUpdate();
            console.log(self.state);
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);

    },
    doSearch: function () {
        alert('do search!');
    },
    addFile: function () {
        window.location.href = '/addfile';
    },

    handleChange: function (e) {
        this.state.area = e.target.value;
        console.log(this.state);
    },

    handleChangeArea: function (e) {
        this.state.area = e.target.value;
        console.log(this.state);
    },

    render: function () {
        return (

            <div className="FilesToolbar">

                <input type="button" value="+ Add New File"
                       className="btn btn-info inline pull-right FilesToolbarAddBtn"
                       onClick={this.addFile}/>
                <div className="FilesToolbarSearchHolder">

                    <div id="reportrange" className="FilesToolbarSearch inline">
                        <i className="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                        <span>{this.state.daterangetext}</span> <b className="caret"></b>
                    </div>
                    <input type="text" className="FilesToolbarSearchInput" placeholder="Search file repository"
                           onChange={this.handleChange}/>
                    <div className="inline">
                        <div className="">
                            <select className="form-control FilesToolbarSearchSelect" onChange={this.handleChangeArea}>
                                <option value="all">All fields</option>
                                <option value="filename">File names</option>
                                <option value="tagvalue">Tags</option>
                                <option value="username">Users</option>
                            </select>
                        </div>
                    </div>
                    <span role="button" className="glyphicon glyphicon-search btn-lg btn-info FilesToolbarSearchBtn"
                          onClick={this.doSearch}></span>
                </div>

            </div>
        );
    }
});

FR.FilesGrid = React.createClass({
    getInitialState: function () {
        return {};
    },

    parseItem: function(item){
        var tags = item.tags;
        var result = tags.map((tag) =>
                  <span className="small">{tag.key}={tag.value}, </span>
            );
        return result;
    },

    downloadItem: function(item){
        console.log('[downloadItem]');
        console.log(item);
        alert('todo');
    },

    deleteItem: function(item){
        console.log('[deleteItem]');
        console.log(item);
        var r = confirm("Are you sure you want to delete this file?");
        if (r === true) {
            alert('deleted!');
        }

    },

    editItem: function(item){
        console.log('[editItem]');
        console.log(item);
        location.href= '/editfile/' + item.id;
    },

    render: function () {

        var data = this.props.data;
        var error = this.props.error;

        console.log('FilesGrid');
        console.log(data);
        if(error){
            return <div>{error}</div>;
        }

        if (data === null) {
            return <div><img src="../static/images/loading.gif"/></div>
        }

        var files = data;
        var len = files.length;
        var items = <tr><td>no data found</td></tr>;

        if (len) {


            items = files.map(function(item, index) {
              return (
                <tr>
                    <td>{item.file_name}<br/><b>Tags:</b> {this.parseItem(item)}</td>
                    <td>{FRUTILS.fixTime(item.modified_time)}</td>
                    <td>todo</td>
                    <td>todo</td>
                    <td className="">
                    <span className="glyphicon glyphicon-cloud-download actionIcon blue" title="Download file" onClick={function(){this.downloadItem(item)}.bind(this)}></span>&nbsp;&nbsp;
                    <span className="glyphicon glyphicon-edit actionIcon orange" title="Edit file" onClick={function(){this.editItem(item)}.bind(this)}></span>&nbsp;&nbsp;
                    <span className="glyphicon glyphicon-remove-sign actionIcon red" title="Delete file" onClick={function(){this.deleteItem(item)}.bind(this)}></span>
                    </td>
                </tr>
              );
            }.bind(this));


        } else {
            items.push(<tr>
                <td>no data found</td>
            </tr>);
        }

        console.log(items);

        return <div className="FilesGridGrid">
            <table className="table table table-striped">
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Modified Date</th>
                    <th>Last User</th>
                    <th>File Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </table>
        </div>


    }
});

FR.FilesGridComponent = React.createClass({

    componentDidMount: function () {
        $.get('/files').done(function (dataJSON) {
                 console.log('[FilesGridComponent componentDidMount ajax]');
                // var dataJSON = JSON.parse(data);
                 console.log(dataJSON);
                var limit_in_url = FRUTILS.getQueryObj().limit;
                var limit = limit_in_url && limit_in_url[0] ? limit_in_url[0] : 20;
                this.setState({
                    data: dataJSON.result,
                    pager: {
                        currentPage: 1,
                        limit: limit,
                        totalPages: Math.ceil(dataJSON.total / limit),
                        totalCount: dataJSON.result.length
                    }
                });

                this.forceUpdate();
            }.bind(this)
        ).fail(function (jqXHR, textStatus) {
            this.setState({
                error: jqXHR.responseText
            });
           console.error('[ERROR]');
           console.error(jqXHR.responseText);
           console.error(textStatus);
        }.bind(this))
    },


    getInitialState: function () {
        return {
            data: null,
            pager: {
                currentPage: 1,
                limit: 20,
                totalPages: 0,
                totalCount: 0
            }
        };
    },

    onPageChange: function () {
        console.log('[onPageChange]');
        var value = this.refs.FilesGridPagerInput.value;
        if (value <= this.state.pager.totalPages) {
            this.state.pager.currentPage = value;
        } else {
            this.refs.FilesGridPagerInput.value = 1;
        }

        this.forceUpdate();
    },


    setLimit: function (limit) {
        //window.location.href = '?limit=' + limit;
        // console.log('setLimit ' + limit);
        this.state.pager.limit = limit;
        this.refs.FilesGridPagerInput.value = 1;
        this.forceUpdate();
    },

    render: function () {
        var pager = this.state.pager;
        var limit = pager.limit;
        var currentPage = pager.currentPage;
        var totalCount = pager.totalCount;
        var totalPages = Math.ceil(totalCount / limit);
        var data = this.state.data;
        var error = this.state.error;
        var self = this;


        return (
            <div className="FilesGrid">
                <FR.FilesToolbar/>
                <div className="FilesGridPagerHolder">
                    <span className="FilesGridPagerInfo">Showing&nbsp;
                        {((currentPage - 1) * limit) + 1}&nbsp;to&nbsp;
                        {currentPage * limit > totalCount ? totalCount : currentPage * limit}
                        &nbsp;of&nbsp;{totalCount}&nbsp;entries.</span>
                    <div className="pull-right ">
                        <div className="inline">
                            Entries per page:&nbsp;
                            {limit == 10 ? (  <b>10</b>   ) : (  <a className="pointer" onClick={function () {
                                    self.setLimit(10)
                                }}>10</a> )}&nbsp;|&nbsp;
                            {limit == 20 ? (  <b>20</b>   ) : (  <a className="pointer" onClick={function () {
                                    self.setLimit(20)
                                }}>20</a> )}&nbsp;|&nbsp;
                            {limit == 30 ? (  <b>30</b>   ) : (  <a className="pointer" onClick={function () {
                                    self.setLimit(30)
                                }}>30</a> )}
                        </div>

                        <div className="FilesGridPagerLinks inline">
                            Page <input className="FilesGridPagerInput" ref="FilesGridPagerInput" type="text"
                                        defaultValue={currentPage} onChange={this.onPageChange}/> of {totalPages}
                        </div>


                    </div>
                    <FR.FilesGrid data={data} error={error}/>


                </div>
            </div>
        );
    }
});


ReactDOM.render(
    <FR.Header/>,
    document.getElementById('header')
);

ReactDOM.render(
    <FR.FilesGridComponent/>,
    document.getElementById('content')
);