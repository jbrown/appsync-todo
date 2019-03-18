import React, { Component } from "react";
import { map } from "async";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import { listTodos } from "./graphql/queries";

class App extends Component {
  render() {
    return (
      <div>
        {this.props.todos.map(item => (
          <div>{item.name}</div>
        ))}
      </div>
    );
  }
}

export default compose(
  graphql(gql(listTodos), {
    options: {
      fetchPolicy: "cache-and-network"
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : []
    })
  })
)(App);
