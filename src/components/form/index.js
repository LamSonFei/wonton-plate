import set from "lodash/set";
import get from "lodash/get";
import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';

/**
 * Custom form that handles JSON mapping and inputs value extractions.
 * Extends a native HTML form element.
 */
export class WontonForm extends mix(HTMLFormElement).with(WontonMixin) {
  static componentName() {
    return "wtn-form";
  }
  /**
   * Gets the contained data as a JSON object.
   * Each property of the JSON object is mapped based on the name of the input.
   */
  getJsonData() {
    let formData = Array.from(this.querySelectorAll("input")).reduce(
      (data, input) => {
        let val;
        switch (input.type) {
          case "date":
            val = input.valueAsDate;
            break;
          case "checkbox":
            val = input.checked;
            break;
          case "radio":
            val = input.checked ? input.value : get(data, input.name);
            break;
          default:
            val = input.value;
        }
        set(data, input.name, val);
        return data;
      },
      {}
    );
    formData = Array.from(this.querySelectorAll("select")).reduce(
      (data, select) => {
        set(data, select.name, select.value);
        return data;
      },
      formData
    );
    return formData;
  }
}
customElements.define(WontonForm.componentName(), WontonForm, {
  extends: "form"
});
