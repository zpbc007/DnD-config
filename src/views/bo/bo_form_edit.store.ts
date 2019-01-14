import { Scope } from 'common/type/scope';
import { action } from 'mobx';
import { getBoConfig } from 'service/bo/bo_edit.service';

export class BoFormEditStore {
    update() {}
    @action
    async fetchJsonSchema(ttid: string, scope: Scope) {
        const { data: { message, result, data } } = await getBoConfig(ttid, 'form');

        console.log('data', data);
    }
}