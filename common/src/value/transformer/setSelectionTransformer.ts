import {Range} from "../Range";
import {Operation, SetSelectionOperation} from "../action/Operation";
import {pointTransformer} from "./pointTransformer";
import {rangeTransformer} from "./rangeTransformer";

function propertiesTransformer(range: null | Partial<Range> | Range, appliedOperation: Operation): Partial<Range> | Range | null {
    if (range === null) return null;
    if (range.anchor !== undefined && range.focus !== undefined) {
        return rangeTransformer(range as Range, appliedOperation);
    } else if (range.anchor !== undefined) {
        let anchor = pointTransformer(range.anchor, appliedOperation);
        if (anchor !== range.anchor) {
            return ({...range, anchor});
        }
    } else if (range.focus !== undefined) {
        let focus = pointTransformer(range.focus, appliedOperation);
        if (focus !== range.focus) {
            return ({...range, focus});
        }
    }
    return range;
}

export function setSelectionTransformer(operation: SetSelectionOperation, appliedOperation: Operation): SetSelectionOperation[] {
    if (appliedOperation.type === "set_selection" || appliedOperation.type === "set_node") return [operation];

    let properties = propertiesTransformer(operation.properties, appliedOperation);
    let newProperties = propertiesTransformer(operation.newProperties, appliedOperation);
    if (properties !== operation.properties || newProperties !== operation.newProperties) {
        return [{...operation, properties, newProperties} as SetSelectionOperation]
    } else {
        return [operation];
    }
}
