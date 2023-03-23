from rest_framework.pagination import PageNumberPagination

class PostPaginator(PageNumberPagination):
    page_size = 8
    page_query_param = 'page'
    max_page_size = 10000

class UserPaginator(PageNumberPagination):
    page_size = 10
    page_query_param= 'page'
    max_page_size = 10000
