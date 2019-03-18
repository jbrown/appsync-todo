import React, { Component } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { graphqlMutation } from "aws-appsync-react";
import { listTodos } from "./graphql/queries";
import { createTodo, deleteTodo } from "./graphql/mutations";

class App extends Component {
  state = { todo: "" };

  addTodo = async () => {
    if (this.state.todo === "") {
      return;
    }

    const response = await this.props.createTodo({
      input: {
        name: this.state.todo,
        completed: false
      }
    });

    this.setState({ todo: "" });
    console.log("response", response);
  };

  deleteTodo = async id => {
    const response = await this.props.deleteTodo({ input: { id } });
    console.log("response", response);
  };

  render() {
    return (
      <div>
        <div>
          <input
            onChange={e => this.setState({ todo: e.target.value })}
            value={this.state.todo}
            placeholder="Enter a name..."
          />
          <button onClick={this.addTodo}>Add</button>
        </div>
        {this.props.todos.map(item => (
          <div key={item.id}>
            {item.name}{" "}
            <button onClick={this.deleteTodo.bind(this, item.id)}>
              remove
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default compose(
  graphqlMutation(gql(createTodo), gql(listTodos), "Todo"),
  graphqlMutation(gql(deleteTodo), gql(listTodos), "Todo"),
  graphql(gql(listTodos), {
    options: {
      fetchPolicy: "network-only"
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : []
    })
  })
)(App);
