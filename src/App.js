import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
    };
  }

  componentDidMount() {
    this.connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.connection.onopen = () => {
      console.log("WebSocket connected");
    };

    this.connection.onclose = () => {
      console.error("WebSocket disconnected");
    };

    this.connection.onerror = (error) => {
      console.error("WebSocket failed to connect", error);
    };

    this.connection.onmessage = async (event) => {
      const blob = event.data;
      const message = await blob.text();

      console.log("WebSocket received", message);

      this.setState({
        messages: [...this.state.messages, message],
      });
    };
  }

  componentWillUnmount() {
    this.connection.close();
  }

  render() {
    return (
      <div>
        <ul id="chat">
          {this.state.messages.map((message, i) => {
            return <li key={i}>{message}</li>;
          })}
        </ul>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            this.connection.send(this.state.message);
            this.setState({ message: "" });
          }}
        >
          <textarea
            rows="8"
            cols="80"
            id="message"
            value={this.state.message}
            onChange={(event) => {
              this.setState({ message: event.target.value });
            }}
          ></textarea>
          <br />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}
