import { useFieldArray } from "react-hook-form";

// Nested structure reference:
// https://codesandbox.io/p/sandbox/react-hook-form-usefieldarray-nested-arrays-m8w6j?file=%2Fsrc%2FnestedFieldArray.js%3A1%2C1-47%2C1

const WikiInfoBoxCollection = ({ nestIndex, control, register }: any) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <label>Nested Array:</label>
            <input
              {...register(`test.${nestIndex}.nestedArray.${k}.field1`, {
                required: true,
              })}
              style={{ marginRight: "25px" }}
            />

            <input {...register(`test.${nestIndex}.nestedArray.${k}.field2`)} />
            <button type="button" onClick={() => remove(k)}>
              Delete Nested
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            field1: "field1",
            field2: "field2",
          })
        }
      >
        Append Nested
      </button>

      <hr />
    </div>
  );
};

export default WikiInfoBoxCollection;
