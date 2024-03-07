import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Text, VStack, HStack, CircularProgress, CircularProgressLabel, useToast } from "@chakra-ui/react";
import { FaPlay, FaPause, FaSyncAlt } from "react-icons/fa";

const PomodoroTimer = () => {
  // Constants
  const pomodoroTime = 25 * 60; // 25 minutes
  const shortBreakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  // State
  const [secondsLeft, setSecondsLeft] = useState(pomodoroTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // 'pomodoro', 'shortBreak', 'longBreak'

  const toast = useToast();

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemain = seconds % 60;
    return `${minutes}:${secondsRemain < 10 ? "0" : ""}${secondsRemain}`;
  };

  // Start timer
  const startTimer = () => {
    setIsActive(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (mode === "pomodoro") {
      setSecondsLeft(pomodoroTime);
    } else if (mode === "shortBreak") {
      setSecondsLeft(shortBreakTime);
    } else if (mode === "longBreak") {
      setSecondsLeft(longBreakTime);
    }
  };

  // Change mode
  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === "pomodoro") {
      setSecondsLeft(pomodoroTime);
    } else if (newMode === "shortBreak") {
      setSecondsLeft(shortBreakTime);
    } else if (newMode === "longBreak") {
      setSecondsLeft(longBreakTime);
    }
  };

  // Effect to handle active timer
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((secondsLeft) => {
          if (secondsLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            toast({
              title: "Time's up!",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
            return 0;
          } else {
            return secondsLeft - 1;
          }
        });
      }, 1000);
    } else if (!isActive && secondsLeft !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, toast]);

  // Calculate progress percentage for CircularProgress
  const maxTime = mode === "pomodoro" ? pomodoroTime : mode === "shortBreak" ? shortBreakTime : longBreakTime;
  const progress = ((maxTime - secondsLeft) / maxTime) * 100;

  return (
    <Container centerContent p={4}>
      <VStack spacing={4} align="stretch" w="100%">
        <Heading textAlign="center">Pomodoro Timer</Heading>
        <CircularProgress value={progress} color="red.400" size="200px" thickness="8px">
          <CircularProgressLabel>{formatTime(secondsLeft)}</CircularProgressLabel>
        </CircularProgress>
        <HStack justify="center" spacing={4}>
          <Button leftIcon={<FaPlay />} onClick={startTimer} isDisabled={isActive}>
            Start
          </Button>
          <Button leftIcon={<FaPause />} onClick={pauseTimer} isDisabled={!isActive}>
            Pause
          </Button>
          <Button leftIcon={<FaSyncAlt />} onClick={resetTimer}>
            Reset
          </Button>
        </HStack>
        <HStack justify="center" spacing={4}>
          <Button variant="outline" onClick={() => changeMode("pomodoro")} isActive={mode === "pomodoro"}>
            Pomodoro
          </Button>
          <Button variant="outline" onClick={() => changeMode("shortBreak")} isActive={mode === "shortBreak"}>
            Short Break
          </Button>
          <Button variant="outline" onClick={() => changeMode("longBreak")} isActive={mode === "longBreak"}>
            Long Break
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default PomodoroTimer;
