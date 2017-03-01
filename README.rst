==================
 jupyter-skeleton
==================

This is a Jupyter extension which causes newly created notebooks to be based on
a skeleton notebook instead of a blank notebook. The path for the skeleton
notebook can be configured.

Installation
============

.. code-block:: bash

    pip install jupyter-skeleton
    jupyter nbextension install [--sys-prefix|--user] --py jupyter_skeleton
    jupyter nbextension enable [--sys-prefix|--user] --py jupyter_skeleton

In your Jupyter configuration directory, edit or create the ``notebook.json``
file and add the skeleton notebook path:

.. code-block:: json

    {
        "skeleton": "skeletons/notebook-skeleton.ipynb"
    }
