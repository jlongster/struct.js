
macro lookup_view {
    case { _ int } => {
        return [makeIdent('I4', #{$name})];
    }

    case { _ double } => {
        return [makeIdent('F8', #{$name})];
    }
}

macro defineRecord {
    case {
        _ $typename {
            $($field : $type) (,) ...
        }
    } => {
        function getSize(type) {
            switch(type) {
            case 'int':
                return 4;
            case 'double':
                return 8;
            }
        }

        function parseTypes(types, offset) {
            if(types.length === 0) {
                return [];
            }

            var name = types[0].token.value;
            var type = types[1].token.value;
            return [[name, type, getSize(type), offset]].concat(
                parseTypes(types.slice(3), offset + getSize(type))
            );
        }

        var types = parseTypes(#{ $($field $type) (,) ... }, 0);
        var recordSize = types.reduce(function(acc, type) {
            return acc + type[2];
        }, 0);

        var offsets = types.map(function(type) {
            return makeValue(type[3])
        });

        return withSyntax($recordSize = [makeValue(recordSize)],
                          $offset ... = offsets) {
            return #{
                macro $typename {
                    case {
                        $ctx $name
                    } => {
                        var SP = makeIdent('SP', #{$name});
                        return withSyntax($SP = [SP]) {
                            return #{
                                var ptr = $SP;
                                $SP -= $recordSize;

                                macro $name {
                                    $(
                                        rule { . $field } => {
                                            lookup_view $type [ptr + $offset]
                                        }
                                    ) ...
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

let function = macro {
    case { _ $id $args { $expr ... } } => {
        var SP = makeIdent('SP', #{$name});
        return withSyntax($SP = [SP]) {
            return #{
                function $id $args {
                    var $prevSP = $SP;
                    $expr ...
                    $SP = $prevSP;
                }
            }
        }
    }
}

var MB = 1024 * 1024;
var STACK_SIZE = 2 * MB;
var SP = STACK_SIZE;

var buffer = new ArrayBuffer(STACK_SIZE);
var U1 = new Uint8Array(buffer);
var I1 = new Int8Array(buffer);
var U2 = new Uint16Array(buffer);
var I2 = new Int16Array(buffer);
var U4 = new Uint32Array(buffer);
var I4 = new Int32Array(buffer);
var F4 = new Float32Array(buffer);
var F8 = new Float64Array(buffer);

defineRecord Point {
    x : double,
    y : double
}

Point foo;

foo.x;
foo.y;

Point bar;

bar.x;
bar.y;

