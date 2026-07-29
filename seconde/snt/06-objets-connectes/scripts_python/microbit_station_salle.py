# Programme MicroPython destiné à une carte micro:bit.
# Il doit être transféré avec l'éditeur Python micro:bit.
# Le module microbit n'est disponible que sur la carte / le simulateur adapté.

from microbit import display, button_a, temperature, sleep
import radio

radio.config(group=23)
radio.on()

seuil_temperature = 24

while True:
    mesure = temperature()

    if mesure > seuil_temperature:
        display.show("!")
        radio.send("VENTILATION:ON")
    else:
        display.show(str(min(9, max(0, mesure // 3))))
        radio.send("VENTILATION:OFF")

    if button_a.was_pressed():
        radio.send("MODE:MANUEL")

    radio.send("TEMPERATURE:" + str(mesure))
    sleep(2000)
