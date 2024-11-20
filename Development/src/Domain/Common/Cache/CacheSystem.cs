using Microsoft.Extensions.Caching.Memory;

namespace Domain.Common
{
    public interface ICachingSystem
    {
        public T GetOrSet<T>(string key, Func<T> getItemCallback, TimeSpan cacheDuration);
        public void Remove(string key);
    }

    public class CachingSystem : ICachingSystem, IGpScoped
    {
        private IMemoryCache _cache;

        public CachingSystem(IMemoryCache memoryCache)
        {
            _cache = memoryCache;
        }

        public T GetOrSet<T>(string key, Func<T> getItemCallback, TimeSpan cacheDuration)
        {
            if (_cache.TryGetValue(key, value: out var cachedItem))
            {
                return (T)cachedItem!;
            }

            T newItem = getItemCallback();
            _cache.Set(key, newItem, cacheDuration);

            return newItem;
        }

        public void Remove(string key)
        {
            var cachedItem = _cache.Get<object?>(key);
            if (cachedItem != null) _cache.Remove(key);
        }
    }
}
