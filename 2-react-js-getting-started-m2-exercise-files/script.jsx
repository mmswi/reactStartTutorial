const Card = React.createClass({
    getInitialState: function () {
      return {};
    },
    componentDidMount: function () {
      $.get("https://api.github.com/users/" + this.props.loginBind, function (data) {
          this.setState(data);
      }.bind(this))
    },
    render: function () {
        return (
            <div>
                <img src={this.state.avatar_url} width="100"/>
                <h3>{this.state.name}</h3>
                <hr/>
            </div>
        )
    }
})

const Form = React.createClass({
    handleSubmit: function (e) {
      e.preventDefault();
      var loginInput = React.findDOMNode(this.refs.loginUsr);
      // Add the card here
        this.props.addCardCaller(loginInput.value)
        loginInput.value = "";
    },
    render: function () {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="github login user" ref="loginUsr"/>
                {/*<!-- ref is a React property -->*/}
                <button>Add</button>
            </form>
        )
    }
})

const Main = React.createClass({
    getInitialState: function() {
      return {logins: ['zpao', 'fisherwebdev']};
    },
    addCard: function (usr) {
        this.setState({logins: this.state.logins.concat(usr)});
    },
    render: function () {
        let cards = this.state.logins.map((login) => {
           return (<Card loginBind={login}/>);
        });
        return (
            <div>
                <Form addCardCaller={this.addCard}/>
                {cards}
            </div>
        )
    }
})

React.render(<Main/>, document.getElementById("root"))