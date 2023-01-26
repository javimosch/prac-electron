import { __decorate } from "tslib";
import { PrimaryKey, Property, Entity } from '@mikro-orm/core';
let BaseEntity = class BaseEntity {
    id;
    createdAt = new Date();
    updatedAt = new Date();
};
__decorate([
    PrimaryKey({ type: 'number' })
], BaseEntity.prototype, "id", void 0);
__decorate([
    Property({ type: Date })
], BaseEntity.prototype, "createdAt", void 0);
__decorate([
    Property({ onUpdate: () => new Date(), type: Date })
], BaseEntity.prototype, "updatedAt", void 0);
BaseEntity = __decorate([
    Entity()
], BaseEntity);
export { BaseEntity };
//# sourceMappingURL=BaseEntity.js.map