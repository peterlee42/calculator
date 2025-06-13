const buttons = document.querySelectorAll('button');

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
	const display = document.querySelector('.display');

	let displayStr = displayValue;

	if (parseFloat(displayValue) >= 1.0e100) {
		displayValue = 'NaN';
		return;
	}

	if (displayStr.length > 16) {
		const num = parseFloat(displayValue);
		displayStr = num.toExponential(12);
	}

	display.textContent = displayStr;
}

updateDisplay();

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		if (displayValue !== 'NaN') {
			if (button.classList.contains('number')) {
				inputDigit(button.textContent);
			} else if (button.classList.contains('operator')) {
				inputOperator(button.textContent);
			} else if (button.classList.contains('equals')) {
				calculate();
			} else if (button.classList.contains('decimal')) {
				inputDecimal();
			} else if (button.classList.contains('percent')) {
				inputPercent();
			} else if (button.classList.contains('sign')) {
				inputSign();
			}
		}

		if (button.classList.contains('clear')) {
			clear();
		}

		updateDisplay();
	});
});

function inputDigit(digit) {
	if (waitingForSecondOperand) {
		displayValue = digit;
		waitingForSecondOperand = false;
	} else {
		displayValue = displayValue === '0' ? digit : displayValue + digit;
	}
}

function inputDecimal() {
	if (waitingForSecondOperand) {
		displayValue = '0.';
		waitingForSecondOperand = false;
		return;
	}
	if (!displayValue.includes('.')) {
		displayValue += '.';
	}
}

function inputOperator(nextOperator) {
	if (operator && waitingForSecondOperand) {
		operator = nextOperator;
		return;
	}

	if (firstOperand === null) {
		firstOperand = parseFloat(displayValue);
	} else if (operator) {
		const result = operate(firstOperand, parseFloat(displayValue), operator);
		displayValue = result.toString();
		firstOperand = result;
	}

	operator = nextOperator;
	waitingForSecondOperand = true;
}

function calculate() {
	if (operator === null || waitingForSecondOperand) return;

	const result = operate(firstOperand, parseFloat(displayValue), operator);
	displayValue = result.toString();
	firstOperand = null;
	operator = null;
	waitingForSecondOperand = false;
}

function clear() {
	displayValue = '0';
	firstOperand = null;
	operator = null;
	waitingForSecondOperand = false;
}

function operate(x, y, op) {
	switch (op) {
		case '+':
			return x + y;
		case '-':
			return x - y;
		case 'x':
			return x * y;
		case '/':
			return y === 0 ? 'NaN' : x / y;
	}
}

function inputPercent() {
	displayValue = (parseFloat(displayValue) / 100).toString();
}

function inputSign() {
	displayValue = (parseFloat(displayValue) * -1).toString();
}
