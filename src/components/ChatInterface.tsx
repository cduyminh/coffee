import React, { useState } from "react";
import styled from "styled-components";
import { coffeebot } from "../startchat";
import { ICurrentResponses } from "../interface";
import { parse } from "best-effort-json-parser";
import ollama from "ollama/browser";
import { IconCheck } from "@tabler/icons-react";

import { Accordion, Avatar, Flex, Loader, Paper, Text } from "@mantine/core";
const ChatContainer = styled.div`
  padding: 0px;
  overflow-y: auto;
  flex-direction: column;
  position: relative;
  width: 50vw;
  min-height: 100vh;
`;

const Container = styled.div`
  min-height: 100vh;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  position: sticky;
  bottom: 20px;
  right: 20px;
  left: 20px;
  border-radius: 10px;
  margin: 10px;
`;

const TextInput = styled.input`
  flex: 1;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
`;

const Message = styled.div`
  padding: 10px;
  margin: 5px;
  color: #e0e0e0;
  border-radius: 10px;
`;

const MenuItem = styled.div`
  margin-bottom: 10px;
  margin-left: 15px;
  border: 1px solid white;
  width: fit-content;
  padding: 0px 20px;
  border-radius: 10px;
`;

interface IChat {
  role: string;
  content: string;
  data?: ICurrentResponses | null;
  done?: boolean;
}

const ChatInterface = ({
  currentResponse = {} as ICurrentResponses,
  setCurrentResponse = {} as React.Dispatch<
    React.SetStateAction<ICurrentResponses>
  >,
}) => {
  const [messages, setMessages] = useState<IChat[]>([
    {
      role: "user",
      content: coffeebot,
    },
  ]);

  const [input, setInput] = useState("");

  const [index, setIndex] = useState(0);

  const [first, setFirst] = useState("");

  const sendMessage = async () => {
    const currIndex = index == 0 ? index + 1 : index + 2;
    setIndex(() => currIndex);
    const newMess1 = {
      ...messages?.[0],
      content:
        coffeebot +
        "Input " +
        (currIndex == 1 ? 1 : currIndex - 1) +
        "\nCustomer: " +
        input +
        "\n",
    };
    const newMess =
      messages.length === 1
        ? [newMess1]
        : [
            ...messages,
            {
              role: "user",
              content:
                "Input " +
                (currIndex == 1 ? 1 : currIndex - 1) +
                "\nCustomer: " +
                input +
                "\n",
            },
          ];
    setMessages(newMess);
    if (messages.length === 1) {
      setFirst(input);
    }

    setInput("");

    let s = "";
    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "user",
          content: newMess?.reduce(
            (acc, msg) =>
              acc +
              (msg?.role === "user" ? msg.content : JSON.stringify(msg.data)),
            ""
          ),
        },
      ],
      format: "json",
      options: { stop: ["\n\n"] },
      stream: true,
    });
    for await (const part of response) {
      console.log(part);
      s += part.message.content;
      const data = parse(s);

      const bot = {
        role: "assistant",
        content: data.response,
        data: data,
        done: part.done,
      };
      setMessages((prev) => {
        const newPrev = [...prev];

        if (prev.length == currIndex) {
          newPrev.push(bot);
        } else {
          if (prev.length > currIndex) {
            console.log(prev.length, currIndex);
            newPrev[currIndex] = bot;
            console.log(newPrev[currIndex]);
          }
        }

        if (data?.currentOrder) {
          setCurrentResponse(data);
        }
        return newPrev;
      });
    }

    const data = parse(s);

    console.log("content", data);

    setMessages((prev) => {
      const newPrev = [...prev];
        if (prev.length > currIndex) {
          console.log(prev.length, currIndex);
          newPrev[currIndex].done = true;
          console.log(newPrev[currIndex]);
        }
      

      if (data?.currentOrder) {
        setCurrentResponse(data);
      }
      return newPrev;
    });
  };

  return (
    <ChatContainer>
      <Container>
        {first && (
          <Message key="first">
            <Flex gap="xs">
              <Avatar
                size="md"
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
              />
              <Paper bg="transparent">
                <Text fw="bolder">Customer</Text>
                {first}
              </Paper>
            </Flex>
          </Message>
        )}
        {messages.map(
          (msg, index) =>
            index > 0 && (
              <Message key={index}>
                <Flex gap="xs">
                  <Avatar
                    size="md"
                    src={
                      msg.role === "user"
                        ? "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
                        : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png"
                    }
                  />
                  <Paper bg="transparent">
                    <Text fw="bolder">
                      {msg.role === "user" ? "User" : "Barista"}
                    </Text>
                    {msg.role === "assistant" && (
                      <Accordion
                        defaultValue="apples"
                        variant="unstyled"
                        w={"fit-content"}
                      >
                        <Accordion.Item key="appples" value="appples">
                          <Accordion.Control>
                            {msg?.done ? (
                              <Flex align="center" gap="xs">
                                <IconCheck />
                                <Text size="xs">Thinking</Text>
                              </Flex>
                            ) : (
                              <Flex align="center" gap="xs">
                                <Loader size="xs" type="dots" />{" "}
                                <Text size="xs">Thinking</Text>
                              </Flex>
                            )}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {msg?.data?.thought && (
                              <Text size="xs">
                                Thought:{msg?.data?.thought}
                              </Text>
                            )}
                            {msg?.data?.move1 && (
                              <Text size="xs">move1:{msg?.data?.move1}</Text>
                            )}
                            {msg?.data?.move2 && (
                              <Text size="xs">move2:{msg?.data?.move2}</Text>
                            )}
                            {msg?.data?.move3 && (
                              <Text size="xs">move3:{msg?.data?.move3}</Text>
                            )}
                            {msg?.data?.move4 && (
                              <Text size="xs">move4:{msg?.data?.move4}</Text>
                            )}
                            {msg?.data?.move5 && (
                              <Text size="xs">move5:{msg?.data?.move5}</Text>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    )}
                    {msg.content}
                  </Paper>
                </Flex>
              </Message>
            )
        )}
        <Message>
          <Flex gap="xl">
            {currentResponse?.currentOrder?.map((order) => {
              return (
                <MenuItem>
                  <h4>{order?.drink}</h4>{" "}
                  <p>{order?.modifiers?.map((modifier) => modifier?.mod)}</p>
                </MenuItem>
              );
            })}
          </Flex>
        </Message>
      </Container>
      <InputContainer>
        <TextInput
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;
