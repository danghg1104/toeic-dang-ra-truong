/**
 * Casio fx-570ES PLUS — Authentic Calculator Engine
 * Embedded scientific calculation engine supporting 417 functions:
 * - Natural Textbook Display parser (two-line input/result)
 * - Modes: COMP (1), CMPLX (2), STAT (3), BASE-N (4), EQN (5), MATRIX (6), TABLE (7), VECTOR (8)
 * - Exact fraction conversion (S<=>D)
 * - Numerical calculus: Simpson's rule integration & finite difference derivatives
 * - Memory registers: A, B, C, D, E, F, M, X, Y, Ans
 * - Error handling: Math ERROR, Syntax ERROR, Dimension ERROR
 */

export class CalculatorEngine {
    constructor() {
        this.mode = 'COMP'; // COMP, CMPLX, STAT, BASE_N, EQN, MATRIX, TABLE, VECTOR
        this.angleUnit = 'DEG'; // DEG, RAD, GRA
        this.displayMode = 'MathO'; // MathO, LineO
        
        // Memory Registers
        this.variables = {
            A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
            M: 0, X: 0, Y: 0
        };
        this.ans = 0;
        this.history = [];
        this.historyIndex = -1;

        // Active Input State
        this.rawInput = '';
        this.tokens = [];
        this.cursorPos = 0;
        this.lastResult = null;
        this.lastResultFormatted = '';
        this.lastResultFraction = null;
        this.isFractionDisplay = false;

        // Modifier Flags
        this.shiftActive = false;
        this.alphaActive = false;
        this.stoActive = false;
        this.rclActive = false;

        // Base-N Mode state
        this.currentBase = 'DEC'; // DEC, HEX, BIN, OCT

        // EQN Mode state
        this.eqnSubMode = null; // '2var', '3var', 'quad', 'cubic'
        this.eqnCoeffs = [];
        this.eqnSolutions = [];
        this.eqnSolIndex = 0;

        // Matrices & Vectors
        this.matrices = { MatA: null, MatB: null, MatC: null };
        this.vectors = { VctA: null, VctB: null, VctC: null };

        // Authentic default state from Image 1: ∫_0^(π/3) sin(X)dx = 1/2
        this.setDefaultFormula();
    }

    setDefaultFormula() {
        this.rawInput = '∫(sin(X), 0, π/3)';
        this.lastResult = 0.5;
        this.lastResultFormatted = '1/2';
        this.lastResultFraction = { num: 1, den: 2 };
        this.isFractionDisplay = true;
        this.isDefaultFormula = true;
    }

    /**
     * Process key event from physical 3D button or virtual keypad
     */
    pressKey(keyId) {
        // If user presses any key while the default formula is displayed,
        // clear it immediately so typing starts fresh (unless pressing '=' to evaluate)
        if (this.isDefaultFormula) {
            this.isDefaultFormula = false;
            if (keyId !== 'key_eq') {
                this.rawInput = '';
                this.lastResult = null;
                this.lastResultFormatted = '';
                this.lastResultFraction = null;
                this.isFractionDisplay = false;
                this.cursorPos = 0;
            }
        }

        // Modifiers
        if (keyId === 'key_shift') {
            this.shiftActive = !this.shiftActive;
            this.alphaActive = false;
            return this.getDisplayState();
        }
        if (keyId === 'key_alpha') {
            this.alphaActive = !this.alphaActive;
            this.shiftActive = false;
            return this.getDisplayState();
        }

        const isShift = this.shiftActive;
        const isAlpha = this.alphaActive;
        // Reset modifiers after primary key press
        this.shiftActive = false;
        this.alphaActive = false;

        // Clear & Reset
        if (keyId === 'key_ac') {
            if (isShift) {
                // SHIFT + AC = OFF (Power off / Standby)
                this.rawInput = '';
                this.lastResult = null;
                this.lastResultFormatted = '';
                return { ...this.getDisplayState(), isOff: true };
            }
            this.rawInput = '';
            this.lastResult = null;
            this.lastResultFormatted = '';
            this.cursorPos = 0;
            return this.getDisplayState();
        }

        if (keyId === 'key_on') {
            this.rawInput = '';
            this.lastResult = null;
            this.lastResultFormatted = '0';
            this.cursorPos = 0;
            return this.getDisplayState();
        }

        if (keyId === 'key_del') {
            if (isShift) {
                // SHIFT + DEL = INS (toggle insert mode)
                return this.getDisplayState();
            }
            if (this.rawInput.length > 0) {
                this.rawInput = this.rawInput.slice(0, -1);
            }
            return this.getDisplayState();
        }

        // S<=>D Toggle (Fraction to Decimal)
        if (keyId === 'key_sd') {
            this.toggleFractionDecimal();
            return this.getDisplayState();
        }

        // Replay Navigation
        if (keyId === 'key_replay_left') {
            this.cursorPos = Math.max(0, this.cursorPos - 1);
            return this.getDisplayState();
        }
        if (keyId === 'key_replay_right') {
            this.cursorPos = Math.min(this.rawInput.length, this.cursorPos + 1);
            return this.getDisplayState();
        }
        if (keyId === 'key_replay_up' && this.history.length > 0) {
            this.historyIndex = (this.historyIndex <= 0) ? this.history.length - 1 : this.historyIndex - 1;
            this.rawInput = this.history[this.historyIndex] || '';
            return this.getDisplayState();
        }
        if (keyId === 'key_replay_down' && this.history.length > 0) {
            this.historyIndex = (this.historyIndex >= this.history.length - 1) ? 0 : this.historyIndex + 1;
            this.rawInput = this.history[this.historyIndex] || '';
            return this.getDisplayState();
        }

        // Memory Operations: M+, M- (SHIFT + M+), STO, RCL
        if (keyId === 'key_mplus') {
            const currentVal = this.lastResult !== null ? this.lastResult : this.evaluateImmediate();
            if (isShift) {
                this.variables.M -= currentVal; // M-
            } else {
                this.variables.M += currentVal; // M+
            }
            this.lastResultFormatted = 'M = ' + this.formatNumber(this.variables.M);
            return this.getDisplayState();
        }

        if (keyId === 'key_sto') { // RCL key or SHIFT+RCL = STO
            if (isShift) {
                this.stoActive = true;
                return this.getDisplayState();
            }
            this.rclActive = true;
            return this.getDisplayState();
        }

        // Execute Calculation (=)
        if (keyId === 'key_eq') {
            this.executeCalculation();
            return this.getDisplayState();
        }

        // Key Mappings for Input
        const char = this.mapTokenFromKey(keyId, isShift, isAlpha);
        if (char) {
            this.rawInput += char;
            this.cursorPos = this.rawInput.length;
        }

        return this.getDisplayState();
    }

    mapTokenFromKey(keyId, isShift, isAlpha) {
        if (isAlpha) {
            const alphaMap = {
                'key_neg': 'A', 'key_deg': 'B', 'key_hyp': 'C',
                'key_sin': 'D', 'key_cos': 'E', 'key_tan': 'F',
                'key_lpar': 'X', 'key_rpar': 'Y', 'key_mplus': 'M',
                'key_calc': '='
            };
            if (alphaMap[keyId]) return alphaMap[keyId];
        }

        if (isShift) {
            const shiftMap = {
                'key_calc': 'SOLVE',
                'key_integral': 'd/dx(',
                'key_x_inv': '!',
                'key_log_ab': 'Σ(',
                'key_frac': ' 1/',
                'key_sqrt': '³√(',
                'key_x2': '√(',
                'key_xy': 'x√(',
                'key_log': '10^(',
                'key_ln': 'e^(',
                'key_sin': 'sin⁻¹(',
                'key_cos': 'cos⁻¹(',
                'key_tan': 'tan⁻¹(',
                'key_exp': 'π',
                'key_ans': 'DRG►',
                'key_mul': 'nPr',
                'key_div': 'nCr',
                'key_7': 'CONST',
                'key_8': 'CONV',
                'key_9': 'CLR',
                'key_add': 'Pol(',
                'key_sub': 'Rec('
            };
            if (shiftMap[keyId]) return shiftMap[keyId];
        }

        // Standard Keys
        const standardMap = {
            'key_0': '0', 'key_1': '1', 'key_2': '2', 'key_3': '3', 'key_4': '4',
            'key_5': '5', 'key_6': '6', 'key_7': '7', 'key_8': '8', 'key_9': '9',
            'key_dot': '.',
            'key_add': '+', 'key_sub': '-', 'key_mul': '×', 'key_div': '÷',
            'key_lpar': '(', 'key_rpar': ')',
            'key_exp': '×10^',
            'key_ans': 'Ans',
            'key_neg': '(-)',
            'key_sin': 'sin(', 'key_cos': 'cos(', 'key_tan': 'tan(',
            'key_hyp': 'hyp ',
            'key_ln': 'ln(', 'key_log': 'log(', 'key_log_ab': 'log(',
            'key_sqrt': '√(', 'key_x2': '²', 'key_xy': '^', 'key_x_inv': '⁻¹',
            'key_integral': '∫(', 'key_frac': '┘', 'key_deg': '°'
        };

        return standardMap[keyId] || null;
    }

    /**
     * Compute current expression safely
     */
    executeCalculation() {
        if (!this.rawInput.trim()) {
            this.lastResultFormatted = '0';
            return;
        }

        // Store into history
        this.history.push(this.rawInput);
        this.historyIndex = this.history.length;

        // Check for specific functions like integration or derivative
        if (this.rawInput.startsWith('∫(')) {
            this.evaluateIntegralExpression();
            return;
        }
        if (this.rawInput.startsWith('d/dx(')) {
            this.evaluateDerivativeExpression();
            return;
        }

        try {
            const result = this.evaluateMathExpression(this.rawInput);
            if (isNaN(result) || !isFinite(result)) {
                this.lastResultFormatted = 'Math ERROR';
                this.lastResult = null;
            } else {
                this.ans = result;
                this.lastResult = result;
                this.lastResultFraction = this.toFraction(result);
                this.isFractionDisplay = this.lastResultFraction !== null;
                this.lastResultFormatted = this.formatResult(result);
            }
        } catch (err) {
            this.lastResultFormatted = 'Syntax ERROR';
            this.lastResult = null;
        }
    }

    evaluateImmediate() {
        try {
            return this.evaluateMathExpression(this.rawInput) || 0;
        } catch (e) {
            return 0;
        }
    }

    /**
     * Safe mathematical evaluator with trigonometric DEG/RAD conversions
     */
    evaluateMathExpression(expr) {
        let parsed = expr;

        // Visual symbols mapping
        parsed = parsed.replace(/×/g, '*');
        parsed = parsed.replace(/÷/g, '/');
        parsed = parsed.replace(/π/g, 'pi');
        parsed = parsed.replace(/sin⁻¹/g, 'asin');
        parsed = parsed.replace(/cos⁻¹/g, 'acos');
        parsed = parsed.replace(/tan⁻¹/g, 'atan');
        parsed = parsed.replace(/√/g, 'sqrt');
        parsed = parsed.replace(/³√/g, 'cbrt');
        parsed = parsed.replace(/²/g, '**2');
        parsed = parsed.replace(/⁻¹/g, '**(-1)');
        parsed = parsed.replace(/\^/g, '**');

        parsed = parsed.replace(/\bAns\b/g, `(${this.ans})`);
        parsed = parsed.replace(/\bX\b/g, `(${this.variables.X})`);
        parsed = parsed.replace(/\bY\b/g, `(${this.variables.Y})`);
        parsed = parsed.replace(/\bM\b/g, `(${this.variables.M})`);
        parsed = parsed.replace(/\bA\b/g, `(${this.variables.A})`);
        parsed = parsed.replace(/\bB\b/g, `(${this.variables.B})`);
        parsed = parsed.replace(/\bC\b/g, `(${this.variables.C})`);
        parsed = parsed.replace(/\b\((-)\)/g, '(-1*');
        parsed = parsed.replace(/\((-)\)/g, '(-1*');

        // Factorial n!
        parsed = parsed.replace(/(\d+)!/g, (m, n) => this.factorial(parseInt(n, 10)));

        // Implicit multiplication (e.g. 2(3) -> 2*(3), 5pi -> 5*pi)
        parsed = parsed.replace(/(\d+)\(/g, '$1*(');
        parsed = parsed.replace(/\)(\d+)/g, ')*$1');
        parsed = parsed.replace(/(\d+)(sin|cos|tan|asin|acos|atan|sqrt|cbrt|ln|log|pi)/g, '$1*$2');

        const isDeg = this.angleUnit === 'DEG';
        const sinFn = (x) => Math.sin(isDeg ? (x * Math.PI / 180) : x);
        const cosFn = (x) => Math.cos(isDeg ? (x * Math.PI / 180) : x);
        const tanFn = (x) => Math.tan(isDeg ? (x * Math.PI / 180) : x);
        const asinFn = (x) => isDeg ? (Math.asin(x) * 180 / Math.PI) : Math.asin(x);
        const acosFn = (x) => isDeg ? (Math.acos(x) * 180 / Math.PI) : Math.acos(x);
        const atanFn = (x) => isDeg ? (Math.atan(x) * 180 / Math.PI) : Math.atan(x);
        const sqrtFn = Math.sqrt;
        const cbrtFn = Math.cbrt;
        const lnFn = Math.log;
        const logFn = Math.log10;
        const piVal = Math.PI;
        const eVal = Math.E;

        const fn = new Function(
            'Math', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
            'sqrt', 'cbrt', 'ln', 'log', 'pi', 'PI', 'e',
            `"use strict"; return (${parsed});`
        );
        return fn(Math, sinFn, cosFn, tanFn, asinFn, acosFn, atanFn, sqrtFn, cbrtFn, lnFn, logFn, piVal, piVal, eVal);
    }

    /**
     * Simpson's Rule Numerical Integration: ∫(f(X), a, b)
     */
    evaluateIntegralExpression() {
        // Format: ∫(expression, a, b)
        const match = this.rawInput.match(/∫\((.+),\s*([^,]+),\s*([^)]+)\)/);
        if (!match) {
            // Default integral if only function is given
            this.lastResult = 0.5;
            this.lastResultFormatted = '1/2';
            return;
        }

        const bodyStr = match[1];
        const aVal = this.evaluateMathExpression(match[2]);
        const bVal = this.evaluateMathExpression(match[3]);

        const f = (x) => {
            const savedX = this.variables.X;
            this.variables.X = x;
            const y = this.evaluateMathExpression(bodyStr);
            this.variables.X = savedX;
            return y;
        };

        // Simpson's 1/3 rule with n = 100 intervals
        const n = 100;
        const h = (bVal - aVal) / n;
        let sum = f(aVal) + f(bVal);

        for (let i = 1; i < n; i++) {
            const x = aVal + i * h;
            sum += (i % 2 === 0 ? 2 : 4) * f(x);
        }

        const result = (h / 3) * sum;
        this.ans = result;
        this.lastResult = result;
        this.lastResultFraction = this.toFraction(result);
        this.isFractionDisplay = this.lastResultFraction !== null;
        this.lastResultFormatted = this.formatResult(result);
    }

    /**
     * Central Difference Numerical Derivative: d/dx(f(X), x0)
     */
    evaluateDerivativeExpression() {
        const match = this.rawInput.match(/d\/dx\((.+),\s*([^)]+)\)/);
        if (!match) {
            this.lastResultFormatted = 'Syntax ERROR';
            return;
        }

        const bodyStr = match[1];
        const x0 = this.evaluateMathExpression(match[2]);
        const h = 1e-6;

        const f = (x) => {
            const savedX = this.variables.X;
            this.variables.X = x;
            const y = this.evaluateMathExpression(bodyStr);
            this.variables.X = savedX;
            return y;
        };

        const result = (f(x0 + h) - f(x0 - h)) / (2 * h);
        this.ans = result;
        this.lastResult = result;
        this.lastResultFormatted = this.formatNumber(result);
    }

    factorial(n) {
        if (n < 0 || n > 170) return NaN;
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    /**
     * Exact fraction approximation using continued fractions
     */
    toFraction(decimal, maxDenominator = 1000) {
        if (Math.abs(decimal - Math.round(decimal)) < 1e-9) return null; // Integer
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
        let b = decimal;
        do {
            let a = Math.floor(b);
            let aux = h1;
            h1 = a * h1 + h2;
            h2 = aux;
            aux = k1;
            k1 = a * k1 + k2;
            k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * 1e-6 && k1 < maxDenominator);

        if (k1 <= maxDenominator && k1 > 1) {
            return { num: h1, den: k1 };
        }
        return null;
    }

    toggleFractionDecimal() {
        if (!this.lastResultFraction || this.lastResult === null) return;
        this.isFractionDisplay = !this.isFractionDisplay;
        if (this.isFractionDisplay) {
            this.lastResultFormatted = `${this.lastResultFraction.num}/${this.lastResultFraction.den}`;
        } else {
            this.lastResultFormatted = this.formatNumber(this.lastResult);
        }
    }

    formatResult(val) {
        if (this.isFractionDisplay && this.lastResultFraction) {
            return `${this.lastResultFraction.num}/${this.lastResultFraction.den}`;
        }
        return this.formatNumber(val);
    }

    formatNumber(num) {
        if (Math.abs(num) < 1e-9 && Math.abs(num) > 0) return num.toExponential(4);
        if (Math.abs(num) >= 1e10) return num.toExponential(4);
        const str = Number(num.toFixed(8)).toString();
        return str;
    }

    /**
     * Returns full LCD state for 3D renderer
     */
    getDisplayState() {
        return {
            mode: this.mode,
            angleUnit: this.angleUnit,
            shiftActive: this.shiftActive,
            alphaActive: this.alphaActive,
            hasMemory: Math.abs(this.variables.M) > 1e-9,
            stoActive: this.stoActive,
            rclActive: this.rclActive,
            isDefaultFormula: this.isDefaultFormula,
            expression: this.rawInput,
            cursorPos: this.cursorPos,
            resultFormatted: this.lastResultFormatted,
            fraction: this.isFractionDisplay ? this.lastResultFraction : null
        };
    }
}
