class DatabaseRouter:
    """
    A router to control all database operations on models
    """

    def db_for_read(self, model, **hints):
        """Suggest the database that should be used for reads"""
        if model._meta.app_label in ['accounts', 'finance']:
            return 'supabase'
        return 'default'

    def db_for_write(self, model, **hints):
        """Suggest the database that should be used for writes"""
        if model._meta.app_label in ['accounts', 'finance']:
            return 'supabase'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations if models are in the same app"""
        db_set = {'default', 'supabase'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure that certain apps' models get created on the right database"""
        if app_label in ['accounts', 'finance']:
            return db == 'supabase'
        return db == 'default'
