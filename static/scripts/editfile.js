var FR = {};


FR.Header = React.createClass({
    logout: function () {
        window.location.href = '/login';
    },
    render: function () {
        var email = FRUTILS.getUser();
        return (
            <div className="header">
                <a href="/"><img src="../static/images/logo1.png" className="logo1"/></a>
                <div className="profile1">
                    <img src="../static/images/profile1.png"/>
                    {email}&nbsp;
                    <input type="submit" value="LOGOUT" className="btn btn-info" onClick={this.logout}/>
                </div>
            </div>
        )
    }
});


FR.FileEditorComponent = React.createClass({

    componentDidMount: function () {

        var FILE_ID = location.href.split('/').pop();
        console.log('FILE_ID');
        console.log(FILE_ID);
        $.get('/file/' + FILE_ID).done(function (dataJSON) {
                console.log('[FileEditorComponent ajax]');
                // var dataJSON = JSON.parse(data);
                //console.log(dataJSON);
                if (dataJSON && dataJSON.is_success) {
                    this.setState({
                        data: dataJSON.result,
                        is_success: dataJSON.is_success
                    });
                } else {
                    this.setState({
                        error: "File not found"
                    });
                }


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
            data: null
        };
    },

    saveTag: function () {
       alert('todo');
    },

    deleteTag: function () {
        alert('todo');
    },

    downloadItem: function () {
       alert('todo');
    },

    deleteItem: function () {
        alert('todo');
    },

    render: function () {

        var data = this.state.data;
        var error = this.state.error;
        var self = this;

        if (error) {
            return <div className="red">{error}</div>
        }

        if (data === null) {
            return <div><img src="../static/images/loading.gif"/></div>
        }

        var tags = data.tags.map(function (item, index) {
            return (
                <div>
                    <label className="TagLabel" >{item.key}:</label>

                    <input className="TagInput" type="text"  defaultValue={item.value} />

                    &nbsp;&nbsp;&nbsp;<span className="glyphicon glyphicon-floppy-disk actionIconSmall orange hidden" title="Save tag"
                                            onClick={function () {
                                                this.saveTag(item)
                                            }.bind(this)}></span>
                    &nbsp;&nbsp;<span className="glyphicon glyphicon-remove-sign actionIconSmall red hidden" title="Delete tag"
                                      onClick={function () {
                                          this.deleteTag(item)
                                      }.bind(this)}></span>
                </div>
            );
        }.bind(this));

        return (
            <div>

                <h2>Edit file: {data.file_name}
                    &nbsp;&nbsp;
                    <span className="glyphicon glyphicon-cloud-download actionIcon blue" title="Download file"
                          onClick={function () {
                              this.downloadItem()
                          }.bind(this)}></span>&nbsp;&nbsp;
                    <span className="glyphicon glyphicon-remove-sign actionIcon red" title="Delete file"
                          onClick={function () {
                              this.deleteItem()
                          }.bind(this)}></span>

                </h2>
                <hr/>
                <input id="input-1" type="file" className="file"/>

                <hr/>
                <h4>Path: {data.path}</h4>
                <h4>Last user: todo</h4>
                <h4>Created time {FRUTILS.fixTime(data.created_time)}</h4>
                <h4>Modified time {FRUTILS.fixTime(data.modified_time)}</h4>
                <hr/>
                <h4>Tags (leave empty if not in use)
                  <span className="glyphicon glyphicon glyphicon-plus actionIcon green" title="Add a tag"
                          onClick={function () {
                              this.deleteItem()
                          }.bind(this)}></span>
                </h4>

                <h5>{tags}</h5>
                <input type="submit" value="Submit" className="btn btn-info btn-large bold"/>
            </div>
        );
    }
});


ReactDOM.render(
    <FR.Header/>,
    document.getElementById('header')
);

ReactDOM.render(
    <FR.FileEditorComponent/>,
    document.getElementById('content')
);