(() => {
    $(() => {
        const VALID_TYPES = ['select', 'text', 'password', 'checkbox'];

        const template = settings => {
            let type, templName;
            [type, templName] = parseSettings(settings);
            if (!type) return;

            $('#submit-block').before(tmpl(templName, settings));
            if (type === 'select') {
                settings.options.forEach(option => $(`#${settings.id}`).append(tmpl('option_tmpl', option)));
            }
        }

        const parseSettings = settings => {
            settings.id = null;

            if (!settings.name) {
                alert('Error: There is control without name property in config');
                return [null, null];
            }

            settings.name = $.trim(settings.name);
            if (settings.type) settings.type = $.trim(settings.type).toLowerCase();

            if (VALID_TYPES.indexOf(settings.type) < 0) {
                alert(`Error: Control ${settings.name} has unsupported type \"${settings.type}\"`);
                return [null, null];
            }

            if (!settings.value) settings.value = '';
            settings.id = settings.name.replace(/\s+/g, '');

            return [settings.type, `${settings.type}_row_tmpl`];
        }

        const processForm = config => {
            let command = '';
            let result_str = '';
            config.forEach(item => {
                if (!item.id) return;

                const $item = $(`#${item.id}`);
                const item_val = item.type === 'checkbox' ? $item.prop("checked") : $item.val();

                if (!item_val.length && !item.type === 'checkbox') return;

                if (item.name.toLowerCase() === 'command')
                    command = item_val;
                else
                    result_str = `${result_str}${item.name}=\'${item_val}\' `;
            });

            result_str += command;
            $("textarea").html(result_str);
            $("#result-area").show();
        }

        $("#result-area").hide();
        const config = JSON.parse(config_data);
        config.forEach(item => {
            template(item);
        });

        $("form").submit(event => {
            processForm(config);
            return false;
        });
        $("form").change(event => {
            processForm(config);
            return false;
        });

    });
})();