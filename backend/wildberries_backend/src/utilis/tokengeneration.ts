import {v4 as uuidv4} from 'uuid';

export function tokengeneration():string{
    return uuidv4();
}