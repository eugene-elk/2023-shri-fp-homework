/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    compose, 
    tap,
    andThen,
    otherwise,
    test,
    partial,
    ifElse,
    prop,
    length,
    __,
    concat,
} from 'ramda';

const api = new Api();

const URL_NUMBERS = 'https://api.tech/numbers/base';
const URL_ANIMALS = 'https://animals.tech/';

const testNumber = test(/^(?=.{2,10}$)^\d+(\.\d+)?$/);
const square = num => num ** 2;
const mod = num => num % 3;

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    
    const handleValidationError = partial(handleError, ['ValidationError']);
    
    const sequenceResult = compose(
        handleSuccess,
        prop(['result'])
    )

    const seqneceAnimal = compose(
        otherwise(handleError),
        andThen(sequenceResult),
        api.get(__, { }),
        concat(URL_ANIMALS),
        String,
        tap(writeLog),
        mod,
        tap(writeLog),
        square,
        tap(writeLog),
        length,
        tap(writeLog),
        prop(['result']),
    )

    const sequenceBinary = compose(
        otherwise(handleError),
        andThen(seqneceAnimal),
        api.get(URL_NUMBERS),
        (value) => ({ from: 10, to: 2, number: value }),
        tap(writeLog),
        Math.round,
        Number
    )

    const validation = ifElse(testNumber, sequenceBinary, handleValidationError)

    const validationSequence = compose(
        validation,
        tap(writeLog),
    )

    validationSequence(value);
}

export default processSequence;
