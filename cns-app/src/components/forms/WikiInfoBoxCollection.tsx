import { useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

// Nested structure reference:
// https://codesandbox.io/p/sandbox/react-hook-form-usefieldarray-nested-arrays-m8w6j?file=%2Fsrc%2FnestedFieldArray.js%3A1%2C1-47%2C1

const WikiInfoBoxCollection = ({ nestIndex, control, register }: any) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`,
  });

  return (
    <div className="border border-sky-200 p-2">
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
            <Button variant={"outline"} type="button" onClick={() => remove(k)}>
              <Trash2 />
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() =>
          append({
            field1: "field1",
            field2: "field2",
          })
        }
      >
        Append Nested
      </Button>
    </div>
  );
};

export default WikiInfoBoxCollection;
