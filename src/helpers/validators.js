import {
    allPass,
    compose, 
    equals, 
    prop, 
    curry, 
    map,
    __,
    gte,
    filter,
    length,
    pipe,
    countBy,
    identity,
    values,
    any,
    not,
    converge
} from 'ramda';

const propStar = prop('star');
const propTriangle = prop('triangle');
const propSquare = prop('square');
const propCircle = prop('circle');
const shapeProps = [propStar, propTriangle, propSquare, propCircle];

const isRed = equals('red');
const isWhite = equals('white');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const redStar = compose(isRed, propStar);
const greenSquare = compose(isGreen, propSquare);
const greenTriangle = compose(isGreen, propTriangle);
const whiteTriangle = compose(isWhite, propTriangle);
const whiteCircle = compose(isWhite, propCircle);
const blueCircle = compose(isBlue, propCircle);
const orangeSquare = compose(isOrange, propSquare);

const isColor = curry((color, shapeProp) => compose(equals(color), shapeProp));
const allColor = color => allPass(map(isColor(color), shapeProps));

const shapeColors = shapeObj => values(shapeObj);

const atLeastTwoGreen = pipe(
  shapeColors,
  filter(isGreen),
  length,
  gte(__, 2)
);

const getColors = shape => shapeProps.map(propFunc => propFunc(shape));

const isNotWhite = compose(not, equals('white'));
const isNotRed = compose(not, equals('red'));
const isNotRedOrWhite = allPass([isNotWhite, isNotRed]);
const starIsNotRedOrWhite = compose(isNotRedOrWhite, propStar)

const greenShapesLen = compose(length, filter(isGreen), shapeColors);
const redShapesLen = compose(length, filter(isRed), shapeColors);

const triangleAndSquareSameColor = converge(equals, [propTriangle, propSquare]);
const triangleIsNotWhite = compose(isNotWhite, propTriangle);
const squareIsNotWhite = compose(isNotWhite, propSquare);

const countRedShapes = pipe(
  shapeColors,
  filter(isRed),
  length
);

const countBlueShapes = pipe(
  shapeColors,
  filter(isBlue),
  length
);

const twoGreenShapes = pipe(
  greenShapesLen,
  equals(2),
);

const oneRedShape = pipe(
  redShapesLen,
  equals(1),
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([whiteTriangle, whiteCircle, greenSquare, redStar]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = atLeastTwoGreen;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRedShapes, countBlueShapes]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([redStar, blueCircle, orangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  getColors,
  filter(isNotWhite), 
  countBy(identity),
  values,
  any(gte(__, 3))
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([twoGreenShapes, oneRedShape, greenTriangle]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allColor('orange');

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = starIsNotRedOrWhite;

// 9. Все фигуры зеленые.
export const validateFieldN9 = allColor('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([triangleAndSquareSameColor, triangleIsNotWhite, squareIsNotWhite]);