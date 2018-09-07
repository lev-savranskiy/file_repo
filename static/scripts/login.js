var FR = {};

FR.Header = React.createClass({
    render: function () {
        return (
            <div className="header">
                <img src="../static/images/logo1.png" className="logo1"/>
            </div>
        )
    }
});


FR.LoginBox = React.createClass({
    handleLoginSubmit: function (Login) {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: Login,
            success: function (data) {
                //this.setState({data: data});
                console.log(data);
                FRUTILS.setUser(Login.email);
                window.location.href = '/'
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    render: function () {
        return (
            <div className="LoginBox">
                {/* perhaps list new Logins here or below the submit box */}
                <FR.LoginForm onLoginSubmit={this.handleLoginSubmit}/>
            </div>
        );
    }
});

FR.LoginForm = React.createClass({
    getInitialState: function () {
        return {
            formValid: false,
            emailValid: false,
            passwordValid: false,
            email: "",
            password: ""
        };
    },

    rules: {
        email: {
            min: 6
        },
        password: {
            min: 1
        }
    },

    handleSubmit: function (e) {
        e.preventDefault();
        this.props.onLoginSubmit({email: this.state.email, password: this.state.password});
    },
    validateEmail: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = (value.length > this.rules.email.min) && re.test(value) && (value.indexOf('@theLevcorp.com') > -1);
        this.state.emailValid = valid;
        this.validateForm();
        return valid;
    },


    validatePassword: function (value) {
        var valid = value.length > this.rules.password.min;
        this.state.passwordValid = valid;
        this.validateForm();
        return valid;
    },

    validateForm: function () {
        var valid = this.state.emailValid && this.state.passwordValid;
        this.state.formValid = valid;
        console.log('validateForm');
        console.log(this.state);
        this.forceUpdate();
    },
    setEmail: function (event) {
        this.state.email = event.target.value
    },
    setPassword: function (event) {
        this.state.password = event.target.value;
    },
    render: function () {
        return (
            <form className="LoginForm" onSubmit={this.handleSubmit}>
                <div className="left large bold">Login</div>

                <FR.TextInput
                    uniqueName="email"
                    type="email"
                    text="Email"
                    required={true}
                    minCharacters={this.rules.email.min}
                    validate={this.validateEmail}
                    onChange={this.setEmail}
                    errorMessage="Please enter email in theLevcorp.com domain"
                    emptyMessage="Email is required"/>

                <FR.TextInput
                    type="password"
                    text="Password"
                    uniqueName="contributor"
                    required={true}
                    minCharacters={this.rules.password.min}
                    validate={this.validatePassword}
                    onChange={this.setPassword}
                    errorMessage="Password is invalid"
                    emptyMessage="Password is required"/>
                <input type="submit" value="LOGIN" className="btn btn-info btn-large bold"
                       disabled={!this.state.formValid}/>
            </form>
        );
    }
});


FR.InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
            <div className={errorClass}>
                <span className="red small">{this.props.errorMessage}</span>
            </div>
        )
    }

});

FR.TextInput = React.createClass({
    getInitialState: function () {
        //most of these variables have to do with handling errors
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "Input is invalid",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        //validate the field locally
        this.validation(event.target.value);

        //Call onChange method on the parent component for updating it's state
        //If saving this field for final form submission, it gets passed
        // up to the top component for sending to the server
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        //The valid variable is optional, and true if not passed in:
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        //we know how to validate text fields based on information passed through props
        if (!valid) {
            //This happens when the user leaves the field, but it is not valid
            //(we do final validation in the parent component, then pass the result
            //here for display)
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            //this happens when we have a required field with no text entered
            //in this case, we want the "emptyMessage" error message
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            //This happens when the text entered is not the required length,
            //in which case we show the regular error message
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        //setting the state will update the display,
        //causing the error message to display if there is one.
        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        //Complete final validation from parent element when complete
        var valid = this.props.validate(event.target.value);
        //pass the result to the local validation element for displaying the error
        this.validation(event.target.value, valid);
    },
    render: function () {

        return (
            <div className={this.props.uniqueName}>
                <input
                    type={this.props.type}
                    placeholder={this.props.text}
                    className={'input  input-' + this.props.uniqueName}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    value={this.state.value}/>

                <FR.InputError
                    visible={this.state.errorVisible}
                    errorMessage={this.state.errorMessage}/>
            </div>
        );
    }
});


ReactDOM.render(
    <FR.LoginBox url="/auth"/>,
    document.getElementById('content')
);

ReactDOM.render(
    <FR.Header/>,
    document.getElementById('header')
);
