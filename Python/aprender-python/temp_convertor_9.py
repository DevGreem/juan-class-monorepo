temp = float(input("Write the temperature: "))
scale = input("It's Fahrenheit or Celsius?: ").lower()

if scale == "f":
    celsius = (temp - 32) * 5/9
    print(celsius)
elif scale == "c":
    fahrenheit = temp * 5/9 + 32
    print(fahrenheit)
else:
    print("Incorrect scale")