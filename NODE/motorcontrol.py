#from flask import Flask, request, render_template, url_for
import serial
from sys import argv

port="/dev/serial0"
saberTooth = serial.Serial(port, 9600)
Ramping = 16
ForwardMotor1 = 0
BackwardsMotor1 = 1
ForwardMotor2 = 4
BackwardsMotor2 = 5



def applySpeed(controllerAddress, motorAddress, speed):
    controllerAddress = int(controllerAddress)
    motorAddress = int(motorAddress)
    speed = int(speed)
    if (motorAddress == 1):
        if (speed >= 0):
            doCommand(controllerAddress, ForwardMotor1, speed)
        else:
            doCommand(controllerAddress, BackwardsMotor1, abs(speed))
    elif (motorAddress == 2):
        if (speed >= 0):
            doCommand(controllerAddress, ForwardMotor2, speed)
        else:
            doCommand(controllerAddress, BackwardsMotor2, abs(speed))

    return ''

def doCommand(controllerAddress, command, parameter):
    global saberTooth
    commandElements = [controllerAddress, command, parameter, (controllerAddress + command + parameter)&127]
    print(controllerAddress, command, parameter)
    saberTooth.write(bytearray(commandElements))

# this python file is expect to be called with three parameters: controllerAddress, motorAddress, speed
applySpeed(argv[1], argv[2], argv[3])