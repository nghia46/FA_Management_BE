import {
  getAllPermissions,
  updatePermission,
} from "./Services/userPermission.service.js";
$(document).ready(function () {
  loadPermission();
  $("#form-user-permission").submit(function (e) {
    e.preventDefault();
    let arr = $(this).serializeArray();
    let kvp = {};
    arr.forEach((item) => {
      if (kvp[item.name] === undefined) {
        kvp[item.name] = [];
      }
      kvp[item.name].push(item.value);
    });
    let data = [];
    let keys = Object.keys(kvp);
    keys.forEach((key) => {
      let rolePermission = {};
      rolePermission["id"] = key;
      rolePermission["featureAccessPermission"] = {};
      kvp[key].forEach((item) => {
        let featurePermission = JSON.parse(item);
        let featureId = Object.keys(featurePermission)[0];
        rolePermission["featureAccessPermission"][featureId] =
          featurePermission[featureId];
      });
      data.push(rolePermission);
    });
    console.log(data);
    updatePermission(data)
      .then(() => {
        loadPermission();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
function loadPermission() {
  $("#form-user-permission").empty();
  getAllPermissions()
  .then((response) => {
    var permissions = {};
    response.Permission.forEach((item) => {
      permissions[item.permissionId] = item.permissionName;
    });
    let table = $("<table>")
      .addClass("table")
      .addClass("table-striped")
      .addClass("table-hover");
    let thead = $("<thead>").addClass("table-dark");
    let headtr = $("<tr>");
    headtr.append($("<th>")); //empty cell
    response.Feature.forEach((feature) => {
      let th = $("<th>");
      th.text(feature.featureName);
      headtr.append(th);
    });
    thead.append(headtr);
    table.append(thead);
    let tbody = $("<tbody>");
    response.UserRole.forEach((role) => {
      let tr = $("<tr>");
      tr.append($("<td>").addClass("fw-bold").text(role.name));
      response.Feature.forEach((feature) => {
        let td = $("<td>");
        if (feature.canChangePermission) {
          let select = $("<select>")
            .prop("name", role.id)
            .addClass("form-select");
          response.Permission.forEach((permission) => {
            if (
              permission.permissionId ===
              role.featureAccessPermission[feature.featureId]
            ) {
              let option = $("<option>")
                .prop(
                  "value",
                  `{"${feature.featureId}": "${permission.permissionId}"}`
                )
                .text(permission.permissionName)
                .prop("selected", true);
              select.append(option);
            } else {
              let option = $("<option>")
                .prop(
                  "value",
                  `{"${feature.featureId}": "${permission.permissionId}"}`
                )
                .text(permission.permissionName);
              select.append(option);
            }
          });
          td.append(select);
        } else {
          let permissionId = role.featureAccessPermission[feature.featureId];
          td.text(permissions[permissionId]);
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);
    $("#form-user-permission").append(table);
    let submitBtn = $("<input>")
      .prop("type", "submit")
      .addClass("btn")
      .addClass("btn-primary")
      .text("Submit");
    $("#form-user-permission").append(submitBtn);
    console.log(table);
  })
  .catch((error) => {
    throw error;
  });
}
