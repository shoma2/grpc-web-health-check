# !/bin/sh

PROTO_PATH=grpc/proto
OUT_DIR=grpc/generated
mkdir -p $OUT_DIR
# curl -Lo grpc/proto/grpc/health/v1/health.proto https://raw.githubusercontent.com/grpc/grpc/master/src/proto/grpc/health/v1/health.proto
PROTOS=($(find grpc/proto -name \*.proto | sed -E "s|^$PROTO_PATH||"))
protoc \
    --proto_path=$PROTO_PATH \
    --js_out="import_style=commonjs:${OUT_DIR}" \
    --grpc-web_out="import_style=typescript,mode=grpcwebtext:${OUT_DIR}" \
    ${PROTOS[@]}

for proto in $(find $PROTO_PATH -name \*.proto); do
    out_file=$(echo $proto | sed -E "s|^$PROTO_PATH|$OUT_DIR|" | sed -E "s/\.proto$//").d.ts
    npx pbjs -t static-module $proto | npx pbts -o $out_file -
done