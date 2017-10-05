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


FR.FileUploadComponent = React.createClass({


    componentDidMount: function () {
        var self = this;


        self.state.message = "Loading configuration...";
        self.state.messagecls = 'green';
        self.forceUpdate();

        $.get('/config').done(function (dataJSON) {

                console.log('[FileUploadComponent file types]');
                self.setState({
                    FILE_TYPES: dataJSON.FILE_TYPES,
                    ENV: dataJSON.ENV,
                    AWS_ACCESS_KEY: dataJSON.AWS_ACCESS_KEY,
                    AWS_SECRET_KEY: dataJSON.AWS_SECRET_KEY,
                    AWS_REGION: dataJSON.AWS_REGION,
                    AWS_BUCKET: dataJSON.AWS_BUCKET
                });


                AWS.config.update({
                    accessKeyId: self.state.AWS_ACCESS_KEY,
                    secretAccessKey: self.state.AWS_SECRET_KEY
                });
                AWS.config.region = self.state.AWS_REGION;

                self.forceUpdate();
//                    self.state.message = "Loading tags...";
//                    self.state.messagecls = 'green';
                self.forceUpdate();
                $.get('/tags').done(function (dataJSON) {

                        self.state.message = "";

                        console.log('[FileUploadComponent tags]');
                        self.setState({
                            tags: dataJSON.result
                        });
                        self.forceUpdate();
                    }.bind(self)
                ).fail(function (jqXHR, textStatus) {
                    self.state.message = "Error getting tags";
                    self.state.messagecls = 'red';
                    self.forceUpdate();
                }.bind(self))


            }.bind(self)
        ).fail(function (jqXHR, textStatus) {
            self.state.message = "Error getting config";
            self.state.messagecls = 'red';
            self.forceUpdate();
        }.bind(self))


    },

    getInitialState: function () {
        return {
            tags: [],
            FILE_TYPES: [],
        };
    },

    handleChange: function () {
        this.forceUpdate();
    },

    getFileName: function () {
        var fileChooser = document.getElementById('file');
        if (!fileChooser) {
            return null;
        }
        var file = fileChooser.files[0];
        if (!file) {
            return null;
        }
        var fname = file.name.replace(/.*[\/\\]/, '');
        return fname;
    },

    getTags: function () {
        console.log('[getTags]');
        var refs = this.refs;
        var res = {};
        console.log(refs);
        for (var k in refs) {
            var item = refs[k];
            if (item.className.indexOf('TagInput') > -1) {
                var val = item.value;
                if (val.length) {
                    res[k] = item.value;

                }

            }

        }

        return res;

    },


    doUpload: function () {
        var self = this;
        console.log('[doUpload]');
        //console.log(arguments);


//todo fix CORS
        var bucket = new AWS.S3({params: {Bucket: self.state.ENV + "/" + self.state.AWS_BUCKET}});
        var bucket = new AWS.S3({params: {Bucket: self.state.AWS_BUCKET}});

        var fileChooser = document.getElementById('file');
        var file = fileChooser.files[0];
        //console.log(file);
        if (file) {

            self.state.message = 'Sending file...';
            self.state.messagecls = 'orange';
            self.forceUpdate();
            var tags = self.getTags();
            var tags_str = $.param(tags);
            var params = {Key: file.name, ContentType: file.type, Body: file, Tagging: tags_str};
            console.log(params);
            bucket.upload(params).on('httpUploadProgress', function (evt) {
                var perc = parseInt((evt.loaded * 100) / evt.total);
                //check if it is NaN
                if (perc === perc) {
                    self.state.message = "Uploaded: " + perc + "%";
                    self.forceUpdate();
                }

            }).send(function (err, data) {
                console.log('[result]');
                console.log(data);
                if (err) {
                    self.state.message = err.toString();
                    self.state.messagecls = 'red';
                } else {
                    self.state.message = 'File uploaded successfully';
                    self.state.messagecls = 'green';
                }

                self.forceUpdate();
                //alert("File uploaded successfully.");
            });
        }
        return false;
    },


    render: function () {

        var self = this;
        var message = this.state.message;
        var ENV = this.state.ENV;
        var AWS_BUCKET = this.state.AWS_BUCKET;
        var messagecls = this.state.messagecls;
        var owner = FRUTILS.getUser();
        var fname = this.getFileName();


        var FILE_TYPES = this.state.FILE_TYPES.map(function (item, index) {
            return (
                <option value={item.key}>{item.key}</option>
            );
        }.bind(this));


        var tagsmap = [];
        var tags = this.state.tags.map(function (item, index) {
            // make sure tags are unique
            if (tagsmap.indexOf(item.key) == -1) {
                tagsmap.push(item.key);

                if (item.key == 'last_user') {
                    return (
                        <div className="TagsHolder">
                            <label className="TagLabel">{item.key}:</label>
                            <input className="TagInput" type="text" disabled ref={item.key} value={owner}/>
                        </div>
                    );
                }

                if (item.key == 'file_type') {
                    return (
                        <div className="TagsHolder">
                            <label className="TagLabel">{item.key}:</label>
                            <select className="TagInput form-control inline" ref={item.key}>
                                {FILE_TYPES}
                            </select>
                        </div>
                    );
                }


                return (
                    <div className="TagsHolder">
                        <label className="TagLabel">{item.key}:</label>
                        <input className="TagInput" type="text" ref={item.key}/>
                    </div>
                );


            }

        }.bind(this));


        return (
            <div>

                <input type="file" name="file" id="file" ref="file" required="" onChange={this.handleChange}/>
                <div className="messageBox">
                    <div className={messagecls}>{message}</div>
                </div>

                Destination: {AWS_BUCKET}/{ENV}/{fname}

                <hr/>
                <h4 className="hidden">Owner: {owner}</h4>
                <h4>Tags (leave input empty if not in use)</h4>
                <div>{tags}</div>
                <button type="submit" ref="submit"
                        className="btn btn-info btn-large bold" onClick={this.doUpload} disabled={!fname}>Submit
                </button>

            </div>
        );
    }
});


ReactDOM.render(
    <FR.Header/>,
    document.getElementById('header')
);

ReactDOM.render(
    <FR.FileUploadComponent/>,
    document.getElementById('content')
);