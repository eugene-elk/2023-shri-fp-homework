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
    anyPass,
    both,
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
const redSquare = compose(isRed, propSquare);
const redCircle = compose(isRed, propCircle);
const greenSquare = compose(isGreen, propSquare);
const greenTriangle = compose(isGreen, propTriangle);
const whiteTriangle = compose(isWhite, propTriangle);
const whiteCircle = compose(isWhite, propCircle);
const blueCircle = compose(isBlue, propCircle);
const orangeSquare = compose(isOrange, propSquare);

const isColor = curry((color, shapeProp) => compose(equals(color), shapeProp));
const allColor = color => allPass(map(isColor(color), shapeProps));

const greenShapes = shape => map(f => f(shape), shapeProps);

const atLeastTwoGreen = pipe(
  greenShapes,
  filter(isGreen),
  length,
  gte(__, 2)
);

const redShapes = shape => map(f => f(shape), shapeProps);
const blueShapes = shape => map(f => f(shape), shapeProps);

const countRedShapes = pipe(
  redShapes,
  filter(isRed),
  length
);

const countBlueShapes = pipe(
  blueShapes,
  filter(isBlue),
  length
);

const getColors = shape => shapeProps.map(propFunc => propFunc(shape));
const isNotWhite = compose(not, equals('white'));

const redNotTriangle = anyPass([redSquare, redCircle, redStar]);
const shapeColors = shapeObj => values(shapeObj);
const greenShapesLen = compose(length, filter(isGreen), shapeColors);

const isNotRedAndNotWhite = compose(not, anyPass([isRed, isWhite]));

const triangleAndSquareSameColor = shapeObj => propTriangle(shapeObj) === propSquare(shapeObj);
const notWhiteColor = shapeObj => not(isWhite(propTriangle(shapeObj))) && not(isWhite(propSquare(shapeObj)));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([whiteTriangle, whiteCircle, greenSquare, redStar]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([redStar, blueCircle, orangeSquare]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allColor('orange');

// 9. Все фигуры зеленые.
export const validateFieldN9 = allColor('green');

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = atLeastTwoGreen;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = shape => equals(countRedShapes(shape), countBlueShapes(shape));

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
    getColors,
    filter(isNotWhite), 
    countBy(identity),
    values,
    any(gte(__, 3))
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = shapeObj => {
    const twoGreenShapes = greenShapesLen(shapeObj) === 2;
    const greenTrianglePresent = greenTriangle(shapeObj);
    const redNotTrianglePresent = redNotTriangle(shapeObj);
    
    return twoGreenShapes && greenTrianglePresent && redNotTrianglePresent;
  }

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(isNotRedAndNotWhite, propStar);;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = shapeObj => both(triangleAndSquareSameColor, notWhiteColor)(shapeObj);
