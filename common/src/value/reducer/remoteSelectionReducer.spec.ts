import {localSelectionReducer} from "./localSelectionReducer";
import {remoteSelectionReducer} from "./remoteSelectionReducer";
import {Path} from "../Path";

describe("Remote Selection Reducer", () => {
    describe("set_selection", () => {
        it("add selection", () => {
            expect(remoteSelectionReducer(null, {
                type: "set_selection",
                properties: null,
                newProperties: {
                    anchor: {path: [0, 0], offset: 1},
                    focus: {path: [0, 0], offset: 1}
                }
            })).toBeNull()
        });
        it("remove selection", () => {
            expect(remoteSelectionReducer({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            }, {
                type: "set_selection",
                properties: {
                    anchor: {path: [0, 0], offset: 1},
                    focus: {path: [0, 0], offset: 1}
                },
                newProperties: null
            })).toEqual({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            })
        });
        it("move anchor", () => {
            expect(remoteSelectionReducer({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            }, {
                type: "set_selection",
                properties: {
                    anchor: {path: [0, 0], offset: 1}
                },
                newProperties: {
                    anchor: {path: [1, 1], offset: 2}
                }
            })).toEqual({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            })
        });
        it("move focus", () => {
            expect(remoteSelectionReducer({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            }, {
                type: "set_selection",
                properties: {
                    focus: {path: [0, 0], offset: 1}
                },
                newProperties: {
                    focus: {path: [1, 1], offset: 2}
                }
            })).toEqual({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            })
        });
        it("move both focus and anchor", () => {
            expect(remoteSelectionReducer({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            }, {
                type: "set_selection",
                properties: {
                    anchor: {path: [0, 0], offset: 1},
                    focus: {path: [0, 0], offset: 1}
                },
                newProperties: {
                    anchor: {path: [1, 1], offset: 2},
                    focus: {path: [1, 1], offset: 2}
                }
            })).toEqual({
                anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 1}
            })
        });
    });
    describe("insert_text", () => {
        let before = 1; let at = 2; let after = 3; let length = 3;
        ([
            ["before-before", [before, before], [before, before]],
            ["before-at", [before, at], [before, at]],
            ["before-after", [before, after], [before, after + length]],
            ["at-at", [at, at], [at + length, at + length]],
            ["at-after", [at, after], [at + length, after + length]],
            ["after-after", [after, after], [after + length, after + length]],
            ["at-before", [at, before], [at, before]],
            ["after-before", [after, before], [after + length, before]],
            ["after-at", [after, at], [after + length, at + length]]
        ] as [string, number[], number[]][]).forEach(([name, offsets, expected]) => {
            it(name, () => {
                expect(remoteSelectionReducer({
                    anchor: {path: [], offset: offsets[0]},
                    focus: {path: [], offset: offsets[1]}
                }, {
                    type: "insert_text", path: [], offset: 2, text: "abc"
                })).toEqual({
                    anchor: {path: [], offset: expected[0]},
                    focus: {path: [], offset: expected[1]}
                })
            })
        });
    });
    describe("remove_text", () => {
        let before = 1; let start = 2; let within = 3; let end = 4; let after = 5; let length = 2;
        ([
            ["before-before", [before, before], [before, before]],
            ["before-start", [before, start], [before, start]],
            ["before-within", [before, within], [before, start]],
            ["before-end", [before, end], [before, start]],
            ["before-after", [before, after], [before, after-length]],
            ["start-start", [start, start], [start, start]],
            ["start-within", [start, within], [start, start]],
            ["start-end", [start, end], [start, start]],
            ["start-after", [start, after], [start, after-length]],
            ["within-within", [within, within], [start, start]],
            ["within-end", [within, end], [start, end-length]],
            ["within-after", [within, after], [start, after-length]],
            ["end-end", [end, end], [start, start]],
            ["end-after", [end, after], [start, after-length]],
            ["after-after", [after, after], [after-length, after-length]],
            ["start-before", [start, before], [start, before]],
            ["within-before", [within, before], [start, before]],
            ["end-before", [end, before], [end-length, before]],
            ["after-before", [after, before], [after-length, before]],
            ["within-start", [within, start], [start, start]],
            ["end-start", [end, start], [start, start]],
            ["after-start", [after, start], [after-length, start]],
            ["end-within", [end, within], [start, start]],
            ["after-within", [after, within], [after-length, start]],
            ["after-end", [after, end], [after-length, start]],
        ] as [string, number[], number[]][]).forEach(([name, offsets, expected]) => {
            it(name, () => {
                expect(remoteSelectionReducer({
                    anchor: {path: [], offset: offsets[0]},
                    focus: {path: [], offset: offsets[1]}
                }, {
                    type: "remove_text", path: [], offset: 2, text: "ab"
                })).toEqual({
                    anchor: {path: [], offset: expected[0]},
                    focus: {path: [], offset: expected[1]}
                })
            });
        });
    });
    describe("insert_node", () => {
        ([
            ["parent's previous", [0], [2, 1]],
            ["parent's previous's child", [0, 1], [1, 1]],
            ["parent", [1], [2, 1]],
            ["previous", [1, 0], [1, 2]],
            ["at", [1, 1], [1, 2]],
            ["next", [1, 2], [1, 1]],
            ["parent's next", [2], [1, 1]]
        ] as [string, Path, Path][]).forEach(([name, initial, expected]) => {
            it(name, () => {
                expect(remoteSelectionReducer({
                    anchor: {path: [1, 1], offset: 5},
                    focus: {path: [1, 1], offset: 5}
                }, {
                    type: "insert_node", path: initial, node: {text: "abc"}
                })).toEqual({
                    anchor: {path: expected, offset: 5},
                    focus: {path: expected, offset: 5}
                })
            });
        })
    });
});
