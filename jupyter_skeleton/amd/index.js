define([
    'base/js/namespace'
], function(
    Jupyter
) {
    var utils = require('base/js/utils');
    var config = require('services/config');

    var common_options = {'base_url': utils.get_body_data('baseUrl')};
    var cfg = new config.ConfigSection('tree', common_options);
    // cfg.load();

    function load_ipython_extension() {
        console.info('jupyter-skeleton extension loaded');
        var contents = Jupyter.new_notebook_widget.contents;
        contents.original_new_untitled = contents.new_untitled;
        contents.new_untitled = function (path, options) {
            console.info(path, options);
            return Promise.all([cfg.load(), contents.original_new_untitled(path, options)])
                .then(function(section_and_created) {
                    var section = section_and_created[0];
                    var created = section_and_created[1];
                    var original = contents.get(
                        section.skeletons.notebook, {type: 'notebook'}
                    );
                    return Promise.all([original, Promise.resolve(created)]);
                })
                .then(function(original_and_created) {
                    var original = original_and_created[0];
                    var created = original_and_created[1];
                    var save_options = {
                        content: original.content,
                        type: original.type
                    };
                    return contents.save(created.path, save_options);
                });
        };
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
