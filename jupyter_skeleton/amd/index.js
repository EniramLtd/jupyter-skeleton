define([
    'base/js/namespace'
], function(
    Jupyter
) {
    var utils = require('base/js/utils');
    var config = require('services/config');

    var common_options = {'base_url': utils.get_body_data('baseUrl')};
    var cfg = new config.ConfigSection('notebook', common_options);

    function load_ipython_extension() {
        console.info('jupyter-skeleton extension loaded');
        var contents = Jupyter.new_notebook_widget.contents;
        contents.original_new_untitled = contents.new_untitled;
        contents.new_untitled = function(path, options) {
            console.info(path, options);
            if (options.type !== 'notebook') {
                // Create text files and other content types without skeletons
                return contents.original_new_untitled(path, options);
            }
            // Load the skeleton path from configuration and create a new
            // untitled notebook
            var untitled = contents.original_new_untitled(path, options);
            return Promise.all([cfg.load(), untitled])
                .then(function(promises) {
                    // Load the skeleton notebook
                    var skeleton_path = promises[0].skeleton;
                    var untitled_metadata = promises[1];
                    return Promise.all([
                        contents.get(skeleton_path, {type: 'notebook'}),
                        untitled_metadata
                    ]);
                })
                .then(function(promises) {
                    // Load back the new untitled notebook, now with contents
                    var skeleton = promises[0];
                    var untitled_metadata = promises[1];
                    return Promise.all([
                        skeleton,
                        contents.get(untitled_metadata.path, {type: 'notebook'})
                    ])
                })
                .then(function(promises) {
                    // Replace cells of the new untitled notebook with cells of
                    // the skeleton notebook, and save it back
                    var skeleton = promises[0];
                    var untitled = promises[1];
                    untitled.content.cells = skeleton.content.cells;
                    var save_options = {
                        content: untitled.content,
                        type: 'notebook'
                    };
                    return contents.save(untitled.path, save_options);
                });
        };
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
