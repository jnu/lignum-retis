# NginX config for wood projects
#
# Copyright 2014 Joe Nudell


upstream python_upstream {
    server unix:/tmp/lignum_uwsgi.sock;
}


server {
    listen %(port)d;
    server_name %(name)s;

    root %(root)s;
    index index.html;
    rewrite  ^/(\?.*)?$  /index.html$1  permanent;

    location / {
        try_files $uri @py_proxy;
    }

    location @py_proxy {
        # UWSGI params
        uwsgi_param QUERY_STRING        $query_string;
        uwsgi_param REQUEST_METHOD      $request_method;
        uwsgi_param CONTENT_TYPE        $content_type;
        uwsgi_param CONTENT_LENGTH      $content_length;

        uwsgi_param REQUEST_URI         $request_uri;
        uwsgi_param PATH_INFO           $document_uri;
        uwsgi_param DOCUMENT_ROOT       $document_root;
        uwsgi_param SERVER_PROTOCOL     $server_protocol;
        uwsgi_param UWSGI_SCHEME        $scheme;

        uwsgi_param REMOTE_ADDR         $remote_addr;
        uwsgi_param REMOTE_PORT         $remote_port;
        uwsgi_param SERVER_PORT         $server_port;
        uwsgi_param SERVER_NAME         $server_name;

        uwsgi_pass python_upstream;
    }
}